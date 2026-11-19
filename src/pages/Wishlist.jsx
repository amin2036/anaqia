import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Wishlist() {
  const { t, wishlist, findProduct } = useStore()
  const items = wishlist.map(findProduct).filter(Boolean)
  return (
    <div className="container page">
      <div className="page-head"><h1>♡ {t('wishlist')}</h1></div>
      {items.length === 0 ? (
        <div className="empty-state"><span className="big-emoji">💜</span><p>{t('emptyWish')}</p><Link to="/shop" className="btn">{t('shopNow')}</Link></div>
      ) : <div className="grid-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  )
}
