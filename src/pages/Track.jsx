import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Demo: the status advances one step every 2 minutes after the order is placed.
const stageOf = (o) => Math.min(4, Math.floor((Date.now() - o.createdAt) / 120000) + 1)

export default function Track() {
  const { t, fmt, orders, lang } = useStore()
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [query, setQuery] = useState(params.get('id') || '')
  const order = orders.find((o) => o.id === query.trim().toUpperCase())
  const stage = order ? stageOf(order) : 0
  return (
    <div className="container page narrow">
      <div className="card track-card">
        <h1>📍 {t('trackTitle')}</h1>
        <p className="muted">{t('trackText')}</p>
        <form className="track-form" onSubmit={(e) => { e.preventDefault(); setQuery(id) }}>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ANQ-123456" />
          <button className="btn">{t('trackBtn')}</button>
        </form>
        {query && !order && <p className="error">{t('notFoundOrder')}</p>}
        {order && (
          <>
            <div className="order-meta">
              <span><b>{order.id}</b></span>
              <span className="muted">{new Date(order.createdAt).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</span>
              <span className="grad-price">{fmt(order.total)}</span>
            </div>
            <ol className="timeline">
              {[0, 1, 2, 3, 4].map((s) => (
                <li key={s} className={s <= stage ? 'done' : ''}><span className="dot">{s <= stage ? '✓' : ''}</span>{t('st' + s)}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}
