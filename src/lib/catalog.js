import { categories as demoCategories, products as demoProducts } from '../data/products.js'
import { strings } from '../i18n.js'

// One shape for products and categories, whether they come from the demo
// catalogue or from the database.
export const fromDbCategory = (c) => ({
  id: c.id, emoji: c.emoji, hue: c.hue, image: c.image_url || '', sort: c.sort, active: c.active,
  name: { en: c.name_en, bn: c.name_bn },
})

export const fromDbProduct = (p) => ({
  id: p.id, cat: p.category_id, emoji: p.emoji, price: p.price, old: p.old_price || p.price,
  stock: p.stock, rating: Number(p.rating), reviews: p.reviews, badge: p.badge || null,
  tags: p.tags || [], sizes: p.sizes || [], colors: p.colors || [], images: p.images || [],
  active: p.active, sort: p.sort,
  name: { en: p.name_en, bn: p.name_bn },
  desc: { en: p.description_en, bn: p.description_bn },
})

export const demoCatalog = () => ({
  categories: demoCategories.map((c) => ({ ...c, image: `images/categories/${c.id}.jpg` })),
  products: demoProducts.map((p) => ({
    ...p, images: p.image ? [p.image] : [], colors: p.colors || [], sizes: p.sizes || [], tags: p.tags || [],
    desc: { en: strings.en.descText, bn: strings.bn.descText },
  })),
  settings: { delivery_inside: 60, delivery_outside: 120, free_over: 3000, store_phone: '', store_email: '', store_address: '', bkash_number: '', nagad_number: '' },
})

export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
