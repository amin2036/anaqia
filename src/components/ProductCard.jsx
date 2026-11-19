import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { discount } from '../data/products.js'
import ProductVisual from './ProductVisual.jsx'
import Stars from './Stars.jsx'

export default function ProductCard({ product }) {
  const { t, fmt, num, pname, addToCart, wishlist, toggleWish } = useStore()
  const wished = wishlist.includes(product.id)
  return (
    <div className="card product-card">
      <Link to={`/product/${product.id}`} className="pc-media">
        <ProductVisual product={product} />
        {product.old > product.price && <span className="badge-off">-{num(discount(product))}%</span>}
        {product.badge && <span className={`badge-tag ${product.badge}`}>{product.badge === 'new' ? 'NEW' : 'HOT'}</span>}
      </Link>
      <button
        className={`wish-btn ${wished ? 'on' : ''}`}
        onClick={() => toggleWish(product.id)}
        aria-label={t('wishlist')}
      >{wished ? '♥' : '♡'}</button>
      <Link to={`/product/${product.id}`} className="pc-name">{pname(product)}</Link>
      <Stars rating={product.rating} reviews={product.reviews} />
      <div className="price-row">
        <b>{fmt(product.price)}</b>
        {product.old > product.price && <s>{fmt(product.old)}</s>}
      </div>
      <button className="btn btn-sm btn-block" disabled={product.stock <= 0} onClick={() => addToCart(product.id, 1, product.sizes?.[0] || null, product.colors?.[0] || null)}>
        {product.stock <= 0 ? t('outOfStock') : <>🛒 {t('addToCart')}</>}
      </button>
    </div>
  )
}
