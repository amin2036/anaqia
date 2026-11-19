import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { delivery } from '../data/products.js'
import ProductVisual from '../components/ProductVisual.jsx'

export function Summary({ zone = 'inside', children }) {
  const { t, fmt, subtotal, couponDiscount, couponCode, shippingFor } = useStore()
  const ship = shippingFor(zone)
  return (
    <div className="card summary">
      <h3>{t('orderSummary')}</h3>
      <div className="sum-row"><span>{t('subtotal')}</span><b>{fmt(subtotal)}</b></div>
      {couponDiscount > 0 && <div className="sum-row discount"><span>{t('discountL')} ({couponCode})</span><b>−{fmt(couponDiscount)}</b></div>}
      <div className="sum-row"><span>{t('shipping')}</span><b>{ship === 0 ? t('free') : fmt(ship)}</b></div>
      <div className="sum-row total"><span>{t('total')}</span><b>{fmt(subtotal - couponDiscount + ship)}</b></div>
      <p className="muted small">🚚 {t('freeShipNote')} {fmt(delivery.freeOver)}</p>
      {children}
    </div>
  )
}

export default function Cart() {
  const { t, fmt, num, pname, cartItems, updateQty, removeFromCart, applyCoupon, couponCode, clearCoupon } = useStore()
  const [code, setCode] = useState(couponCode)
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="container page empty-state">
        <span className="big-emoji">🛍️</span>
        <h1>{t('emptyCart')}</h1>
        <Link to="/shop" className="btn">{t('continueShopping')}</Link>
      </div>
    )
  }
  return (
    <div className="container page">
      <div className="page-head"><h1>{t('yourCart')}</h1><p className="muted">{num(cartItems.length)} {t('items')}</p></div>
      <div className="two-col">
        <div className="cart-list">
          {cartItems.map(({ id, qty, size, product }) => (
            <div key={id + size} className="card cart-row">
              <Link to={`/product/${id}`}><ProductVisual product={product} size="sm" /></Link>
              <div className="cart-info">
                <Link to={`/product/${id}`}><b>{pname(product)}</b></Link>
                {size && <small className="muted">{t('size')}: {size}</small>}
                <span className="grad-price">{fmt(product.price)}</span>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(id, size, qty - 1)}>−</button><span>{num(qty)}</span><button onClick={() => updateQty(id, size, qty + 1)}>+</button>
              </div>
              <b className="line-total">{fmt(qty * product.price)}</b>
              <button className="remove" onClick={() => removeFromCart(id, size)} aria-label={t('remove')}>✕</button>
            </div>
          ))}
          <Link to="/shop" className="muted">← {t('continueShopping')}</Link>
        </div>
        <Summary>
          <form className="coupon" onSubmit={(e) => {
            e.preventDefault()
            setMsg(applyCoupon(code) ? 'ok' : 'bad')
          }}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={`${t('coupon')} (WELCOME20)`} />
            <button className="btn btn-sm">{t('apply')}</button>
          </form>
          {msg === 'ok' && <p className="success small">✓ {t('couponApplied')} <button className="link" onClick={() => { clearCoupon(); setCode(''); setMsg('') }}>{t('remove')}</button></p>}
          {msg === 'bad' && <p className="error small">{t('invalidCoupon')}</p>}
          <button className="btn btn-block" onClick={() => nav('/checkout')}>{t('checkout')} →</button>
        </Summary>
      </div>
    </div>
  )
}
