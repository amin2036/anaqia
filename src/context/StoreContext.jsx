import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { strings } from '../i18n.js'
import { findProduct, coupons, delivery } from '../data/products.js'

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
function usePersisted(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => {
    try { localStorage.setItem('anaqia:' + key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const [lang, setLang] = usePersisted('lang', 'bn')
  const [cart, setCart] = usePersisted('cart', []) // [{id, qty, size}]
  const [wishlist, setWishlist] = usePersisted('wishlist', [])
  const [users, setUsers] = usePersisted('users', [])
  const [user, setUser] = usePersisted('user', null)
  const [orders, setOrders] = usePersisted('orders', [])
  const [couponCode, setCouponCode] = usePersisted('coupon', '')
  const [toast, setToast] = useState('')

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const t = useCallback((key) => strings[lang][key] ?? strings.en[key] ?? key, [lang])
  const fmt = useCallback(
    (n) => '৳\u2009' + new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN').format(Math.round(n)),
    [lang]
  )
  const num = useCallback((n) => new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN').format(n), [lang])
  const pname = useCallback((pr) => pr.name[lang] || pr.name.en, [lang])

  const notify = (msg) => {
    setToast(msg)
    clearTimeout(window.__anaqiaToast)
    window.__anaqiaToast = setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (id, qty = 1, size = null) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id && x.size === size)
      if (i >= 0) return c.map((x, j) => (j === i ? { ...x, qty: x.qty + qty } : x))
      return [...c, { id, qty, size }]
    })
    notify(t('added'))
  }
  const updateQty = (id, size, qty) =>
    setCart((c) => c.map((x) => (x.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x)))
  const removeFromCart = (id, size) => setCart((c) => c.filter((x) => !(x.id === id && x.size === size)))
  const toggleWish = (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  const cartItems = useMemo(
    () => cart.map((x) => ({ ...x, product: findProduct(x.id) })).filter((x) => x.product),
    [cart]
  )
  const cartCount = cartItems.reduce((s, x) => s + x.qty, 0)
  const subtotal = cartItems.reduce((s, x) => s + x.qty * x.product.price, 0)

  const couponDiscount = (() => {
    const c = coupons[couponCode]
    if (!c || subtotal < c.min) return 0
    return c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value
  })()
  const applyCoupon = (code) => {
    const c = coupons[code.trim().toUpperCase()]
    if (!c || subtotal < c.min) return false
    setCouponCode(code.trim().toUpperCase())
    return true
  }
  const shippingFor = (zone) => (subtotal - couponDiscount >= delivery.freeOver || subtotal === 0 ? 0 : delivery[zone])

  const placeOrder = (info) => {
    const id = 'ANQ-' + String(Math.floor(100000 + Math.random() * 900000))
    const shipping = shippingFor(info.zone)
    const order = {
      id, info, createdAt: Date.now(), userEmail: user?.email || null,
      items: cartItems.map(({ id, qty, size, product }) => ({ id, qty, size, price: product.price })),
      subtotal, discount: couponDiscount, shipping, total: subtotal - couponDiscount + shipping,
    }
    setOrders((o) => [order, ...o])
    setCart([])
    setCouponCode('')
    return id
  }

  const register = ({ name, email, password }) => {
    if (users.some((u) => u.email === email)) return false
    const u = { name, email, password }
    setUsers((x) => [...x, u])
    setUser({ name, email })
    return true
  }
  const login = ({ email, password }) => {
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) return false
    setUser({ name: u.name, email: u.email })
    return true
  }
  const logout = () => setUser(null)

  const value = {
    lang, setLang, t, fmt, num, pname,
    cartItems, cartCount, subtotal, addToCart, updateQty, removeFromCart,
    couponCode, couponDiscount, applyCoupon, clearCoupon: () => setCouponCode(''), shippingFor,
    wishlist, toggleWish, user, register, login, logout, orders, placeOrder, toast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
