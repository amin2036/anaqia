// Generates supabase/seed.sql from the demo catalogue in src/data/products.js.
// Usage: node scripts/make-seed.mjs
import { writeFileSync, existsSync } from 'node:fs'
import { categories, products, coupons } from '../src/data/products.js'
import { strings } from '../src/i18n.js'

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const arr = (a) => `array[${(a || []).map(q).join(',')}]::text[]`
const lines = ['-- Demo catalogue for Anaqia. Run after schema.sql. Safe to re-run (updates existing rows).', 'begin;']

categories.forEach((c, i) => {
  lines.push(`insert into public.categories (id, name_en, name_bn, emoji, hue, sort) values (${q(c.id)}, ${q(c.name.en)}, ${q(c.name.bn)}, ${q(c.emoji)}, ${q(c.hue)}, ${i})
  on conflict (id) do update set name_en = excluded.name_en, name_bn = excluded.name_bn, emoji = excluded.emoji, hue = excluded.hue, sort = excluded.sort;`)
})
products.forEach((p, i) => {
  const img = existsSync(`public/${p.image}`) ? [p.image] : []
  lines.push(`insert into public.products (id, category_id, name_en, name_bn, description_en, description_bn, price, old_price, stock, emoji, images, sizes, badge, tags, rating, reviews, sort)
  values (${q(p.id)}, ${q(p.cat)}, ${q(p.name.en)}, ${q(p.name.bn)}, ${q(strings.en.descText)}, ${q(strings.bn.descText)}, ${p.price}, ${p.old ?? 'null'}, ${p.stock}, ${q(p.emoji)}, ${arr(img)}, ${arr(p.sizes)}, ${q(p.badge)}, ${arr(p.tags)}, ${p.rating}, ${p.reviews}, ${i})
  on conflict (id) do nothing;`)
})
for (const [code, c] of Object.entries(coupons)) {
  lines.push(`insert into public.coupons (code, type, value, min_order) values (${q(code)}, ${q(c.type)}, ${c.value}, ${c.min}) on conflict (code) do nothing;`)
}
lines.push('commit;')
writeFileSync('supabase/seed.sql', lines.join('\n') + '\n')
console.log(`seed.sql: ${categories.length} categories, ${products.length} products`)
