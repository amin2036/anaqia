import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { findProduct, products, categoryOf, discount } from '../data/products.js'
import ProductVisual from '../components/ProductVisual.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Stars from '../components/Stars.jsx'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { id } = useParams()
  const product = findProduct(id)
  const { t, lang, fmt, num, pname, addToCart, wishlist, toggleWish } = useStore()
  const [size, setSize] = useState(product?.sizes?.[0] || null)
  const [qty, setQty] = useState(1)
  const nav = useNavigate()
  if (!product) return <NotFound />
  const cat = categoryOf(product.cat)
  const related = products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4)
  const wished = wishlist.includes(product.id)

  return (
    <div className="container page">
      <p className="crumbs muted">
        <Link to="/">{t('home')}</Link> / <Link to={`/shop?cat=${cat.id}`}>{cat.name[lang]}</Link> / {pname(product)}
      </p>
      <div className="product-detail">
        <div className="card pd-media"><ProductVisual product={product} size="lg" /></div>
        <div className="pd-info">
          <span className="pill-cat">{cat.emoji} {cat.name[lang]}</span>
          <h1>{pname(product)}</h1>
          <Stars rating={product.rating} reviews={product.reviews} />
          <div className="pd-price">
            <b>{fmt(product.price)}</b><s>{fmt(product.old)}</s>
            <span className="badge-off static">-{num(discount(product))}% {t('off')}</span>
          </div>
          <p className="success">● {t('inStock')}</p>
          {product.sizes && (
            <div className="pd-opt"><h4>{t('size')}</h4>
              <div className="chips">{product.sizes.map((s) => (
                <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}</div>
            </div>
          )}
          <div className="pd-opt"><h4>{t('qty')}</h4>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{num(qty)}</span><button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <div className="pd-actions">
            <button className="btn" onClick={() => addToCart(product.id, qty, size)}>🛒 {t('addToCart')}</button>
            <button className="btn btn-ghost" onClick={() => { addToCart(product.id, qty, size); nav('/cart') }}>{t('buyNow')}</button>
            <button className={`icon-btn big ${wished ? 'wished' : ''}`} onClick={() => toggleWish(product.id)} aria-label={t('wishlist')}>{wished ? '♥' : '♡'}</button>
          </div>
          <div className="pd-perks">
            <span>🚚 {t('fast')}</span><span>↩️ {t('returns')}</span><span>💵 {t('cod')}</span>
          </div>
          <div className="card pd-desc"><h4>{t('description')}</h4><p className="muted">{t('descText')}</p></div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>{t('related')}</h2></div>
          <div className="grid-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  )
}
