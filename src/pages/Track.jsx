import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'delivered']

export default function Track() {
  const { t, fmt, lang, trackOrder, orders } = useStore()
  const [params] = useSearchParams()
  const initial = params.get('id') || ''
  const known = orders.find((o) => o.id === initial)
  const [id, setId] = useState(initial)
  const [phone, setPhone] = useState(known?.info?.phone || '')
  const [result, setResult] = useState(undefined) // undefined = not searched, null = not found
  const [busy, setBusy] = useState(false)

  const search = async (e) => {
    e?.preventDefault()
    setBusy(true)
    setResult(await trackOrder(id, phone))
    setBusy(false)
  }
  const stage = result ? STEPS.indexOf(result.status) : -1
  const cancelled = result?.status === 'cancelled'

  return (
    <div className="container page narrow">
      <div className="card track-card">
        <h1>📍 {t('trackTitle')}</h1>
        <p className="muted">{t('trackText')}</p>
        <form className="track-form col" onSubmit={search}>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ANQ-123456" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('phoneUsed')} inputMode="tel" required />
          <button className="btn" disabled={busy}>{busy ? t('loading') : t('trackBtn')}</button>
        </form>
        {result === null && <p className="error">{t('notFoundOrder')}</p>}
        {result && (
          <>
            <div className="order-meta">
              <span><b>{result.code}</b></span>
              <span className="muted">{new Date(result.created_at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</span>
              <span className="grad-price">{fmt(result.total)}</span>
            </div>
            {cancelled ? <p className="error">✕ {t('stCancelled')}</p> : (
              <ol className="timeline">
                {STEPS.map((s, i) => (
                  <li key={s} className={i <= stage ? 'done' : ''}><span className="dot">{i <= stage ? '✓' : ''}</span>{t('st' + i)}</li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  )
}
