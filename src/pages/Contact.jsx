import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import SocialLinks from '../components/SocialLinks.jsx'

export default function Contact() {
  const { t, settings } = useStore()
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
          {settings.store_address && <p>📍 {settings.store_address}</p>}
          {settings.store_phone && <p>📞 <a href={`tel:${settings.store_phone}`}>{settings.store_phone}</a></p>}
          {settings.store_phone && <p>💬 <a href={`https://wa.me/88${settings.store_phone.replace(/\D/g, '').replace(/^88/, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></p>}
          {settings.store_email && <p>✉️ <a href={`mailto:${settings.store_email}`}>{settings.store_email}</a></p>}
          <p>🕘 {t('hours')}</p>
          {settings.facebook_url && <p>📘 <a href={settings.facebook_url} target="_blank" rel="noreferrer">Facebook: {settings.facebook_url.replace(/^https?:\/\/(www\.)?/, '')}</a></p>}
          <SocialLinks />
          <p className="muted small"><Link to="/help">{t('help')}</Link> · <Link to="/returns">{t('returnsP')}</Link></p>
        </div>
      </div>
    </div>
  )
}
