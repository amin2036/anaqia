import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t, lang, categories, settings } = useStore()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo size={40} tagline />
          <p className="muted footer-about">{t('aboutText')}</p>
          {settings.store_phone && <p className="muted small">📞 <a href={`tel:${settings.store_phone}`}>{settings.store_phone}</a></p>}
          {settings.store_email && <p className="muted small">✉️ <a href={`mailto:${settings.store_email}`}>{settings.store_email}</a></p>}
          <div className="socials">
            {['f', 'ig', '▶', '𝕏'].map((s) => <span key={s} className="social">{s}</span>)}
          </div>
        </div>
        <div>
          <h4>{t('shop')}</h4>
          {categories.slice(0, 5).map((c) => <Link key={c.id} to={`/shop?cat=${c.id}`}>{c.name[lang]}</Link>)}
        </div>
        <div>
          <h4>{t('customerCare')}</h4>
          <Link to="/help">{t('help')}</Link>
          <Link to="/track">{t('track')}</Link>
          <Link to="/returns">{t('returnsP')}</Link>
          <Link to="/contact">{t('contact')}</Link>
        </div>
        <div>
          <h4>{t('payWith')}</h4>
          <div className="pay-badges">
            <span className="pay bkash">bKash</span>
            <span className="pay nagad">Nagad</span>
            <span className="pay visa">VISA</span>
            <span className="pay master">Mastercard</span>
            <span className="pay cod">COD</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Anaqia. {t('rights')}</span>
        <span><Link to="/terms">{t('terms')}</Link> · <Link to="/privacy">{t('privacy')}</Link></span>
      </div>
    </footer>
  )
}
