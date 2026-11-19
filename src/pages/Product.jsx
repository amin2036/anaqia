import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { discount } from '../data/products.js'
import ProductVisual from '../components/ProductVisual.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Stars from '../components/Stars.jsx'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { id } = useParams()
  const { t, lang, fmt, num, pname, addToCart, wishlist, toggleWish, findProduct, categoryOf, products, loading } = useStore()
  const product = findProduct(id)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const nav = useNavigate()
  if (!product) return loading ? <div className="container page empty-state"><p className="muted">{t('loading')}</p></div> : <NotFound />

  const cat = categoryOf(product.cat)
  const related = products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4)
  const wished = wishlist.includes(product.id)
  const images = product.images || []
  const selSize = size ?? product.sizes?.[0] ?? null
  const selColor = color ?? product.colors?.[0] ?? null
  const soldOut = product.stock <= 0
  const add = () => addToCart(product.id, qty, selSize, selColor)

  return (
    <div className="container page">
      <p className="crumbs muted">
        <Link to="/">{t('home')}</Link> / {cat && <><Link to={`/shop?cat=${cat.id}`}>{cat.name[lang]}</Link> / </>}{pname(product)}
      </p>
      <div className="product-detail">
        <div className="pd-gallery">
          <div className="card pd-media"><ProductVisual product={product} size="lg" image={images[imgIdx]} /></div>
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((src, i) => (
                <button key={src + i} className={`thumb ${i === imgIdx ? 'on' : ''}`} onClick={() => setImgIdx(i)} aria-label={`${i + 1}`}>
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pd-info">
          {cat && <span className="pill-cat">{cat.emoji} {cat.name[lang]}</span>}
          <h1>{pname(product)}</h1>
          <Stars rating={product.rating} reviews={product.reviews} />
          <div className="pd-price">
            <b>{fmt(product.price)}</b>
            {product.old > product.price && <><s>{fmt(product.old)}</s><span className="badge-off static">-{num(discount(product))}% {t('off')}</span></>}
          </div>
          {soldOut ? <p className="error">● {t('outOfStock')}</p> : <p className="success">● {t('inStock')}{product.stock <= 5 && <> ({t('onlyLeft')} {num(product.stock)})</>}</p>}
          {product.colors?.length > 0 && (
            <div className="pd-opt"><h4>{t('color')}: <span className="muted">{selColor}</span></h4>
              <div className="chips">{product.colors.map((c) => (
                <button key={c} className={`chip ${selColor === c ? 'on' : ''}`} onClick={() => setColor(c)}>{c}</button>
              ))}</div>
            </div>
          )}
          {product.sizes?.length > 0 && (
            <div className="pd-opt"><h4>{t('size')}</h4>
              <div className="chips">{product.sizes.map((s) => (
                <button key={s} className={`chip ${selSize === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}</div>
            </div>
          )}
          <div className="pd-opt"><h4>{t('qty')}</h4>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{num(qty)}</span>
              <button onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}>+</button>
            </div>
          </div>
          <div className="pd-actions">
            <button className="btn" disabled={soldOut} onClick={add}>🛒 {t('addToCart')}</button>
            <button className="btn btn-ghost" disabled={soldOut} onClick={() => { add(); nav('/cart') }}>{t('buyNow')}</button>
            <button className={`icon-btn big ${wished ? 'wished' : ''}`} onClick={() => toggleWish(product.id)} aria-label={t('wishlist')}>{wished ? '♥' : '♡'}</button>
          </div>
          <div className="pd-perks">
            <span>🚚 {t('fast')}</span><span>↩️ {t('returns')}</span><span>💵 {t('cod')}</span>
          </div>
          <div className="card pd-desc"><h4>{t('description')}</h4><p className="muted pre">{product.desc?.[lang] || product.desc?.en || t('descText')}</p></div>
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
