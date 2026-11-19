import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function Contact() {
  const { t } = useStore()
  const [sent, setSent] = useState(false)
  return (
    <div className="container page">
      <div className="page-head"><h1>{t('contactTitle')}</h1><p className="muted">{t('contactText')}</p></div>
      <div className="two-col contact">
        <form className="card form-card" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          {sent ? <p className="success">✓ {t('sent')}</p> : (
            <div className="form-grid">
              <label>{t('name')} *<input required /></label>
              <label>{t('phone')}<input inputMode="tel" /></label>
              <label className="span-2">Email *<input type="email" required /></label>
              <label className="span-2">{t('message')} *<textarea rows="5" required /></label>
              <button className="btn span-2">{t('send')}</button>
            </div>
          )}
        </form>
        <div className="card contact-info">
          <h3>{t('about')}</h3>
          <p className="muted">{t('aboutText')}</p>
          <p>📍 {t('address1')}</p>
          <p>📞 16XXX · +880 1700-000000</p>
          <p>✉️ support@anaqia.com</p>
          <p>🕘 {t('hours')}</p>
        </div>
      </div>
    </div>
  )
}
