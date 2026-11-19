import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import Logo from './Logo.jsx'

export default function Header() {
  const { t, lang, setLang, cartCount, wishlist, user, num } = useStore()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    nav(`/shop?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }
  const links = [
    ['/', t('home')], ['/shop', t('shop')], ['/shop?deals=1', t('deals')], ['/track', t('track')], ['/contact', t('contact')],
  ]
  return (
    <header className="header">
      <div className="container header-top">
        <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <Link to="/" className="brand-link" aria-label="Anaqia home"><Logo size={38} /></Link>
        <form className="search" onSubmit={submit}>
          <span>🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} />
        </form>
        <div className="header-actions">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === 'bn' ? 'on' : ''} onClick={() => setLang('bn')}>বাং</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <Link to={user ? '/account' : '/login'} className="icon-btn" title={user ? t('account') : t('login')}>👤</Link>
          <Link to="/wishlist" className="icon-btn" title={t('wishlist')}>
            ♡{wishlist.length > 0 && <em>{num(wishlist.length)}</em>}
          </Link>
          <Link to="/cart" className="icon-btn" title={t('cart')}>
            🛍️{cartCount > 0 && <em>{num(cartCount)}</em>}
          </Link>
        </div>
      </div>
      <nav className={`container main-nav ${open ? 'open' : ''}`}>
        <form className="search search-mobile" onSubmit={submit}>
          <span>🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} />
        </form>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
    </header>
  )
}
