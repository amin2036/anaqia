import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { strings } from '../i18n.js'
import { coupons as demoCoupons } from '../data/products.js'
import { supabase, isLive } from '../lib/supabase.js'
import { demoCatalog, fromDbCategory, fromDbProduct } from '../lib/catalog.js'

const StoreContext = createContext(null)

// localStorage helpers that never throw (private mode, blocked storage, etc.)
function load(key, fallback) {
  try {
    const v = localStorage.getItem('anaqia:' + key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try { localStorage.setItem('anaqia:' + key, JSON.stringify(value)) } catch { /* ignore */ }
}
function usePersisted(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => { save(key, value) }, [key, value])
  return [value, setValue]
}

async function fetchCatalog() {
  const [cats, prods, sets] = await Promise.all([
    supabase.from('categories').select('*').eq('active', true).order('sort'),
    supabase.from('products').select('*').eq('active', true).order('sort'),
    supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
  ])
  if (cats.error || prods.error) throw cats.error || prods.error
  return {
    categories: cats.data.map(fromDbCategory),
    products: prods.data.map(fromDbProduct),
    settings: { ...demoCatalog().settings, ...(sets.data || {}) },
  }
}

export function StoreProvider({ children }) {
  const [lang, setLang] = usePersisted('lang', 'bn')
  const [cart, setCart] = usePersisted('cart', []) // [{id, qty, size, color}]
  const [wishlist, setWishlist] = usePersisted('wishlist', [])
  const [coupon, setCoupon] = usePersisted('coupon2', null) // {code, type, value, min}
  const [localOrders, setLocalOrders] = usePersisted('orders', [])
  const [demoUsers, setDemoUsers] = usePersisted('users', [])
  const [demoUser, setDemoUser] = usePersisted('user', null)
  const [authUser, setAuthUser] = useState(null)
  const [toast, setToast] = useState('')

  // Catalogue: demo data, or the database (with the last copy cached for a fast first paint).
  const [catalog, setCatalog] = useState(() => (isLive ? load('catalog', null) : null) || (isLive ? { categories: [], products: [], settings: demoCatalog().settings } : demoCatalog()))
  const [loading, setLoading] = useState(isLive && !load('catalog', null))
  const [loadError, setLoadError] = useState(false)

  const reloadCatalog = useCallback(async () => {
    if (!isLive) return
    try {
      const c = await fetchCatalog()
      setCatalog(c); save('catalog', c); setLoadError(false)
    } catch (e) {
      console.error(e); setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { reloadCatalog() }, [reloadCatalog])

  useEffect(() => {
    if (!isLive) return
    supabase.auth.getSession().then(({ data }) => setAuthUser(data.session?.user || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthUser(session?.user || null))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const t = useCallback((key) => strings[lang][key] ?? strings.en[key] ?? key, [lang])
  const fmtNum = useCallback((n) => new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN').format(n), [lang])
  const fmt = useCallback((n) => '৳ ' + fmtNum(Math.round(n)), [fmtNum])
  const num = fmtNum
  const pname = useCallback((pr) => pr.name[lang] || pr.name.en, [lang])

  const { categories, products, settings } = catalog
  const findProduct = useCallback((id) => products.find((x) => x.id === id), [products])
  const categoryOf = useCallback((id) => categories.find((c) => c.id === id), [categories])

  const notify = (msg) => {
    setToast(msg)
    clearTimeout(window.__anaqiaToast)
    window.__anaqiaToast = setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (id, qty = 1, size = null, color = null) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id && x.size === size && (x.color || null) === color)
      if (i >= 0) return c.map((x, j) => (j === i ? { ...x, qty: x.qty + qty } : x))
      return [...c, { id, qty, size, color }]
    })
    notify(t('added'))
  }
  const same = (x, id, size, color) => x.id === id && x.size === size && (x.color || null) === (color || null)
  const updateQty = (id, size, qty, color = null) =>
    setCart((c) => c.map((x) => (same(x, id, size, color) ? { ...x, qty: Math.max(1, qty) } : x)))
  const removeFromCart = (id, size, color = null) => setCart((c) => c.filter((x) => !same(x, id, size, color)))
  const toggleWish = (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  const cartItems = useMemo(
    () => cart.map((x) => ({ ...x, product: products.find((p) => p.id === x.id) })).filter((x) => x.product),
    [cart, products]
  )
  const cartCount = cartItems.reduce((s, x) => s + x.qty, 0)
  const subtotal = cartItems.reduce((s, x) => s + x.qty * x.product.price, 0)

  const couponDiscount = (() => {
    if (!coupon || subtotal < coupon.min) return 0
    return coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
  })()
  const applyCoupon = async (code) => {
    const c = code.trim().toUpperCase()
    let found = null
    if (isLive) {
      const { data } = await supabase.rpc('get_coupon', { p_code: c })
      found = data
    } else if (demoCoupons[c]) {
      found = { code: c, ...demoCoupons[c] }
    }
    if (!found || subtotal < found.min) return false
    setCoupon(found)
    return true
  }
  const shippingFor = (zone) =>
    subtotal === 0 || subtotal - couponDiscount >= settings.free_over ? 0 : zone === 'inside' ? settings.delivery_inside : settings.delivery_outside

  // ----- customer accounts -----
  const user = isLive
    ? authUser && { name: authUser.user_metadata?.name || authUser.email.split('@')[0], email: authUser.email, id: authUser.id }
    : demoUser

  // Returns the new order code. Throws on failure (database message in err.message).
  const placeOrder = async (info) => {
    const shipping = shippingFor(info.zone)
    let id
    if (isLive) {
      const { data, error } = await supabase.rpc('place_order', {
        p: {
          name: info.name, phone: info.phone, address: info.address, district: info.district, note: info.note,
          method: info.method, payment_ref: info.paymentRef || '', coupon: coupon?.code || '',
          items: cartItems.map(({ id, qty, size, color }) => ({ id, qty, size: size || '', color: color || '' })),
        },
      })
      if (error) throw error
      id = data
      reloadCatalog() // stock changed
    } else {
      id = 'ANQ-' + String(Math.floor(100000 + Math.random() * 900000))
    }
    // Local copy for the confirmation page (and for tracking in demo mode).
    const order = {
      id, info: { ...info, paymentRef: undefined }, createdAt: Date.now(), userEmail: user?.email || null,
      items: cartItems.map(({ id, qty, size, color, product }) => ({ id, qty, size, color, price: product.price })),
      subtotal, discount: couponDiscount, shipping, total: subtotal - couponDiscount + shipping,
    }
    setLocalOrders((o) => [order, ...o].slice(0, 30))
    setCart([])
    setCoupon(null)
    return id
  }

  // Returns 'ok' | 'confirm' (check email) | error key
  const register = async ({ name, email, password }) => {
    if (isLive) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) return error.message.toLowerCase().includes('registered') ? 'exists' : 'errGeneric'
      return data.session ? 'ok' : 'confirm'
    }
    if (demoUsers.some((u) => u.email === email)) return 'exists'
    setDemoUsers((x) => [...x, { name, email, password }])
    setDemoUser({ name, email })
    return 'ok'
  }
  const login = async ({ email, password }) => {
    if (isLive) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return !error
    }
    const u = demoUsers.find((x) => x.email === email && x.password === password)
    if (!u) return false
    setDemoUser({ name: u.name, email: u.email })
    return true
  }
  const logout = async () => {
    if (isLive) await supabase.auth.signOut()
    else setDemoUser(null)
  }
  const fetchMyOrders = async () => {
    if (!isLive) return localOrders.filter((o) => o.userEmail === user?.email).map((o) => ({ code: o.id, created_at: o.createdAt, total: o.total, status: 'placed', qty: o.items.reduce((s, i) => s + i.qty, 0) }))
    const { data } = await supabase.from('orders').select('code, created_at, total, status, order_items(qty)').order('created_at', { ascending: false })
    return (data || []).map((o) => ({ ...o, qty: o.order_items.reduce((s, i) => s + i.qty, 0) }))
  }
  const trackOrder = async (code, phone) => {
    const c = code.trim().toUpperCase()
    if (isLive) {
      const { data } = await supabase.rpc('track_order', { p_code: c, p_phone: phone })
      return data
    }
    const o = localOrders.find((x) => x.id === c)
    if (!o) return null
    const stage = Math.min(4, Math.floor((Date.now() - o.createdAt) / 120000) + 1)
    return { code: o.id, status: ['placed', 'confirmed', 'packed', 'shipped', 'delivered'][stage], created_at: o.createdAt, total: o.total }
  }

  const value = {
    lang, setLang, t, fmt, num, pname, isLive, loading, loadError, reloadCatalog,
    categories, products, settings, findProduct, categoryOf,
    cartItems, cartCount, subtotal, addToCart, updateQty, removeFromCart,
    coupon, couponCode: coupon?.code || '', couponDiscount, applyCoupon, clearCoupon: () => setCoupon(null), shippingFor,
    wishlist, toggleWish, user, register, login, logout, orders: localOrders, placeOrder, fetchMyOrders, trackOrder,
    toast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
