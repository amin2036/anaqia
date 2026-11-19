import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { categories } from '../data/products.js'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t, lang } = useStore()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo size={40} tagline />
          <p className="muted footer-about">{t('aboutText')}</p>
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
          <Link to="/contact">{t('help')}</Link>
          <Link to="/track">{t('track')}</Link>
          <Link to="/contact">{t('returnsP')}</Link>
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
        <span><Link to="/contact">{t('terms')}</Link> · <Link to="/contact">{t('privacy')}</Link></span>
      </div>
    </footer>
  )
}
