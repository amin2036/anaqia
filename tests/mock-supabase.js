// In-memory stand-in for Supabase, used only by `ANAQIA_MOCK=1 vite build` for testing.
import { categories, products, coupons } from '../src/data/products.js'
export { errorKey } from '../src/lib/supabase-errors.js'

const db = {
  categories: categories.map((c, i) => ({ id: c.id, name_en: c.name.en, name_bn: c.name.bn, emoji: c.emoji, hue: c.hue, image_url: null, sort: i, active: true })),
  products: products.map((p, i) => ({ id: p.id, category_id: p.cat, name_en: p.name.en, name_bn: p.name.bn, description_en: 'desc', description_bn: 'বিবরণ', price: p.price, old_price: p.old, stock: p.stock, emoji: p.emoji, images: [p.image], sizes: p.sizes || [], colors: [], badge: p.badge || null, tags: p.tags || [], rating: p.rating, reviews: p.reviews, active: true, sort: i })),
  coupons: Object.entries(coupons).map(([code, c]) => ({ code, type: c.type, value: c.value, min_order: c.min, active: true, expires_at: null, created_at: new Date().toISOString() })),
  settings: [{ id: 1, delivery_inside: 60, delivery_outside: 120, free_over: 3000, store_phone: '', store_email: '', store_address: '', bkash_number: '', nagad_number: '' }],
  orders: [], order_items: [],
}
window.__mockdb = db
let session = null
const listeners = []
const clone = (x) => JSON.parse(JSON.stringify(x))
const keyOf = { categories: 'id', products: 'id', coupons: 'code', settings: 'id', orders: 'id' }

class Q {
  constructor(t) { this.t = t; this.f = []; this.op = 'select'; this.ord = null; this.lim = null; this.one = null; this.embed = false }
  select(cols = '*') { if (this.op === 'select') this.op = 'select'; this.embed = cols.includes('order_items'); return this }
  eq(k, v) { this.f.push((r) => r[k] === v); return this }
  in(k, v) { this.f.push((r) => v.includes(r[k])); return this }
  order(k, o = {}) { this.ord = [k, o.ascending !== false]; return this }
  limit(n) { this.lim = n; return this }
  maybeSingle() { this.one = 'maybe'; return this }
  single() { this.one = 'single'; return this }
  insert(row) { this.op = 'insert'; this.row = row; return this }
  update(row) { this.op = 'update'; this.row = row; return this }
  delete() { this.op = 'delete'; return this }
  run() {
    const T = db[this.t]
    const rows = () => T.filter((r) => this.f.every((fn) => fn(r)))
    if (this.op === 'insert') {
      const r = Array.isArray(this.row) ? this.row : [this.row]
      for (const x of r) { if (T.some((y) => y[keyOf[this.t]] === x[keyOf[this.t]])) return { error: { message: 'duplicate key value' } } }
      T.push(...clone(r)); return { data: null, error: null }
    }
    if (this.op === 'update') { rows().forEach((r) => Object.assign(r, clone(this.row))); return { data: null, error: null } }
    if (this.op === 'delete') {
      if (this.t === 'categories' && rows().some((c) => db.products.some((p) => p.category_id === c.id))) return { error: { message: 'violates foreign key' } }
      const del = rows(); db[this.t] = T.filter((r) => !del.includes(r)); return { data: null, error: null }
    }
    let out = clone(rows())
    if (this.embed) out = out.map((o) => ({ ...o, order_items: clone(db.order_items.filter((i) => i.order_id === o.id)) }))
    if (this.ord) { const [k, asc] = this.ord; out.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (asc ? 1 : -1)) }
    if (this.lim) out = out.slice(0, this.lim)
    if (this.one) return { data: out[0] || null, error: null }
    return { data: out, error: null }
  }
  then(res, rej) { return Promise.resolve(this.run()).then(res, rej) }
}

const rpcs = {
  is_admin: () => !!session,
  get_coupon: ({ p_code }) => { const c = db.coupons.find((x) => x.code === p_code && x.active); return c ? { code: c.code, type: c.type, value: c.value, min: c.min_order } : null },
  place_order: ({ p }) => {
    if (!/^01\d{9}$/.test(p.phone)) throw { message: 'invalid_phone' }
    let sub = 0
    for (const i of p.items) { const pr = db.products.find((x) => x.id === i.id); if (!pr || pr.stock < i.qty) throw { message: 'out_of_stock:' + i.id }; sub += pr.price * i.qty }
    const c = db.coupons.find((x) => x.code === p.coupon)
    const disc = c && sub >= c.min_order ? (c.type === 'percent' ? Math.round(sub * c.value / 100) : c.value) : 0
    const ship = sub - disc >= 3000 ? 0 : p.district === 'Dhaka' ? 60 : 120
    const id = crypto.randomUUID(); const code = 'ANQ-' + (100000 + Math.floor(Math.random() * 900000))
    db.orders.push({ id, code, customer_name: p.name, phone: p.phone, address: p.address, district: p.district, note: p.note, payment_method: p.method, payment_ref: p.payment_ref || null, status: 'placed', subtotal: sub, discount: disc, shipping: ship, total: sub - disc + ship, coupon_code: disc ? p.coupon : null, admin_note: null, created_at: new Date().toISOString(), user_id: session?.user.id || null })
    p.items.forEach((i, n) => { const pr = db.products.find((x) => x.id === i.id); pr.stock -= i.qty; db.order_items.push({ id: n + Date.now(), order_id: id, product_id: pr.id, name: pr.name_en, image: pr.images[0], price: pr.price, qty: i.qty, size: i.size || null, color: i.color || null }) })
    return code
  },
  track_order: ({ p_code, p_phone }) => { const o = db.orders.find((x) => x.code === p_code && x.phone.slice(-10) === p_phone.replace(/\D/g, '').slice(-10)); return o ? { code: o.code, status: o.status, created_at: o.created_at, total: o.total } : null },
  admin_stats: () => ({ today_sales: db.orders.reduce((s, o) => s + o.total, 0), today_orders: db.orders.length, week_sales: 0, month_sales: 0, month_orders: db.orders.length, pending: db.orders.length, products: db.products.length, low_stock: db.products.filter((p) => p.stock <= 5).map((p) => ({ id: p.id, name: p.name_bn, stock: p.stock })) }),
}

export const supabase = {
  from: (t) => new Q(t),
  rpc: async (name, args) => { try { return { data: rpcs[name](args || {}), error: null } } catch (e) { return { data: null, error: e } } },
  auth: {
    getSession: async () => ({ data: { session } }),
    signInWithPassword: async ({ email, password }) => {
      if (password !== 'admin123') return { error: { message: 'Invalid login' } }
      session = { user: { id: 'u1', email, user_metadata: { name: 'Admin' } } }; listeners.forEach((l) => l('SIGNED_IN', session)); return { error: null }
    },
    signUp: async ({ email }) => { session = { user: { id: 'u2', email, user_metadata: {} } }; listeners.forEach((l) => l('SIGNED_IN', session)); return { data: { session }, error: null } },
    signOut: async () => { session = null; listeners.forEach((l) => l('SIGNED_OUT', null)) },
    onAuthStateChange: (cb) => { listeners.push(cb); return { data: { subscription: { unsubscribe() {} } } } },
  },
  storage: { from: () => ({ upload: async () => ({ error: null }), getPublicUrl: (p) => ({ data: { publicUrl: 'images/products/honey.jpg?' + p } }) }) },
}
export const isLive = true
export const IMAGE_BUCKET = 'product-images'
