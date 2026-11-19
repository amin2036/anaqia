import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function OrderSuccess() {
  const { id } = useParams()
  const { t, fmt, orders } = useStore()
  const order = orders.find((o) => o.id === id)
  return (
    <div className="container page empty-state">
      <span className="big-emoji success-pop">✅</span>
      <h1>{t('orderPlaced')}</h1>
      <p className="muted">{t('orderId')}</p>
      <div className="code-box big"><b>{id}</b></div>
      {order && <p>{t('total')}: <b className="grad-price">{fmt(order.total)}</b> · {t(order.info.method)}</p>}
      <div className="hero-cta center">
        <Link to={`/track?id=${id}`} className="btn">{t('trackThis')}</Link>
        <Link to="/shop" className="btn btn-ghost">{t('continueShopping')}</Link>
      </div>
    </div>
  )
}
