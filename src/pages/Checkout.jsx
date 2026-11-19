import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { districts } from '../data/products.js'
import { errorKey } from '../lib/supabase.js'
import { Summary } from './Cart.jsx'

const methods = [
  { id: 'cod', icon: '💵', cls: 'cod' },
  { id: 'bkash', icon: 'b', cls: 'bkash' },
  { id: 'nagad', icon: 'n', cls: 'nagad' },
  { id: 'card', icon: '💳', cls: 'card' },
]

export default function Checkout() {
  const { t, fmt, num, pname, cartItems, user, placeOrder, settings } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState({ name: user?.name || '', phone: '', address: '', district: 'Dhaka', note: '', wallet: '', trx: '', cardNo: '', exp: '', cvc: '' })
  const [method, setMethod] = useState('cod')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (cartItems.length === 0) return <Navigate to="/cart" replace />

  const zone = f.district === 'Dhaka' ? 'inside' : 'outside'
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    const base = f.name && /^01\d{9}$/.test(f.phone.replace(/\D/g, '')) && f.address
    const payOk = method === 'cod' || method === 'card' ? (method === 'cod' || (f.cardNo.replace(/\s/g, '').length >= 12 && f.exp && f.cvc)) : (f.wallet && f.trx)
    if (!base || !payOk) { setErr(t('required')); return }
    setBusy(true); setErr('')
    try {
      const id = await placeOrder({
        name: f.name, phone: f.phone, address: f.address, district: f.district, note: f.note, method, zone,
        // Card details are never sent or stored; wallet payments send the number + transaction ID for checking.
        paymentRef: method === 'bkash' || method === 'nagad' ? `${f.wallet} / ${f.trx}` : '',
      })
      nav(`/order/${id}`)
    } catch (ex) {
      setErr(t(errorKey(ex)))
      setBusy(false)
    }
  }

  return (
    <div className="container page">
      <div className="page-head"><h1>{t('checkoutTitle')}</h1><p className="muted">{t('demoNote')}</p></div>
      <form className="two-col" onSubmit={submit} noValidate>
        <div className="checkout-main">
          <div className="card form-card">
            <h3>📦 {t('shippingInfo')}</h3>
            <div className="form-grid">
              <label>{t('fullName')} *<input value={f.name} onChange={set('name')} required /></label>
              <label>{t('phone')} *<input value={f.phone} onChange={set('phone')} placeholder="01XXXXXXXXX" inputMode="tel" required /></label>
              <label className="span-2">{t('address')} *<input value={f.address} onChange={set('address')} required /></label>
              <label>{t('district')}
                <select value={f.district} onChange={set('district')}>{districts.map((d) => <option key={d}>{d}</option>)}</select>
              </label>
              <label>{t('shipping')}<input readOnly value={zone === 'inside' ? t('insideDhaka') : t('outsideDhaka')} /></label>
              <label className="span-2">{t('note')}<textarea rows="2" value={f.note} onChange={set('note')} /></label>
            </div>
          </div>
          <div className="card form-card">
            <h3>💳 {t('payment')}</h3>
            <div className="pay-methods">
              {methods.map((m) => (
                <button type="button" key={m.id} className={`pay-method ${method === m.id ? 'on' : ''}`} onClick={() => setMethod(m.id)}>
                  <span className={`pm-icon ${m.cls}`}>{m.icon}</span>{t(m.id)}
                </button>
              ))}
            </div>
            {(method === 'bkash' || method === 'nagad') && (
              <div className="pay-extra">
                <p className="muted small">{t('mobileWallet')} <b>{(method === 'bkash' ? settings.bkash_number : settings.nagad_number) || '01700-000000'}</b></p>
                <div className="form-grid">
                  <label>{t('walletNumber')} *<input value={f.wallet} onChange={set('wallet')} placeholder="01XXXXXXXXX" /></label>
                  <label>{t('trxId')} *<input value={f.trx} onChange={set('trx')} placeholder="8N7A6D5..." /></label>
                </div>
              </div>
            )}
            {method === 'card' && (
              <div className="pay-extra form-grid">
                <label className="span-2">{t('cardNumber')} *<input value={f.cardNo} onChange={set('cardNo')} placeholder="4242 4242 4242 4242" inputMode="numeric" /></label>
                <label>{t('expiry')} *<input value={f.exp} onChange={set('exp')} placeholder="12/28" /></label>
                <label>{t('cvc')} *<input value={f.cvc} onChange={set('cvc')} placeholder="123" inputMode="numeric" /></label>
              </div>
            )}
            <p className="muted small">🔒 {t('demoNote')}</p>
          </div>
        </div>
        <Summary zone={zone}>
          <div className="mini-items">
            {cartItems.map(({ id, qty, size, color, product }) => (
              <div key={id + size + color} className="mini-item"><span>{product.emoji} {pname(product)} × {num(qty)}</span><b>{fmt(qty * product.price)}</b></div>
            ))}
          </div>
          {err && <p className="error small">{err}</p>}
          <button className="btn btn-block" type="submit" disabled={busy}>{busy ? t('loading') : <>{t('placeOrder')} ✓</>}</button>
          <Link to="/cart" className="muted small">← {t('yourCart')}</Link>
        </Summary>
      </form>
    </div>
  )
}
