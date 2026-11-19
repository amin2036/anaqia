import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { discount } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Shop() {
  const { t, lang, fmt, num, categories, products, loading } = useStore()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'all'
  const q = (params.get('q') || '').toLowerCase()
  const deals = params.get('deals') === '1'
  const [sort, setSort] = useState('pop')
  const maxPrice = Math.max(1000, ...products.map((p) => p.price))
  const [limitState, setLimit] = useState(null)
  const limit = limitState ?? maxPrice

  const list = useMemo(() => {
    let l = products.filter((p) =>
      (cat === 'all' || p.cat === cat) &&
      p.price <= limit &&
      (!deals || discount(p) >= 25 || p.tags?.includes('flash')) &&
      (!q || p.name.en.toLowerCase().includes(q) || p.name.bn.includes(q) || p.cat.includes(q))
    )
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating)
    if (sort === 'pop') l = [...l].sort((a, b) => b.reviews - a.reviews)
    return l
  }, [cat, q, deals, sort, limit, products])

  const setCat = (c) => {
    const next = new URLSearchParams(params)
    if (c === 'all') next.delete('cat'); else next.set('cat', c)
    setParams(next)
  }
  const title = deals ? t('deals') : cat === 'all' ? t('shop') : categories.find((c) => c.id === cat)?.name[lang]

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{title}</h1>
        <p className="muted">{num(list.length)} {t('results')}{q && <> · “{params.get('q')}”</>}</p>
      </div>
      <div className="shop-layout">
        <aside className="card filters">
          <h4>{t('categories')}</h4>
          <button className={`filter-btn ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>🛍️ {t('all')}</button>
          {categories.map((c) => (
            <button key={c.id} className={`filter-btn ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
              {c.emoji} {c.name[lang]}
            </button>
          ))}
          <h4>{t('priceRange')}: {fmt(limit)}</h4>
          <input type="range" min="300" max={maxPrice} step="100" value={limit} onChange={(e) => setLimit(+e.target.value)} />
        </aside>
        <div>
          <div className="shop-toolbar">
            <label>{t('sort')}:{' '}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="pop">{t('sortPop')}</option>
                <option value="low">{t('sortLow')}</option>
                <option value="high">{t('sortHigh')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </label>
          </div>
          {list.length === 0 ? <p className="empty">{loading ? t('loading') : t('noResults')}</p> :
            <div className="grid-3 grid-shop">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
        </div>
      </div>
    </div>
  )
}
