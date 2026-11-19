import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, Link } from 'react-router-dom'
import { supabase, isLive } from '../lib/supabase.js'
import { LogoIcon } from '../components/Logo.jsx'
import Dashboard from './Dashboard.jsx'
import Orders from './Orders.jsx'
import Products from './Products.jsx'
import ProductForm from './ProductForm.jsx'
import Categories from './Categories.jsx'
import Coupons from './Coupons.jsx'
import Settings from './Settings.jsx'
import './admin.css'

function SetupNotice() {
  return (
    <div className="adm-center">
      <div className="adm-card adm-narrow">
        <LogoIcon size={56} />
        <h1>অ্যাডমিন প্যানেল এখনো চালু হয়নি</h1>
        <p className="adm-muted">ডেটাবেস (Supabase) এখনো যুক্ত করা হয়নি। <code>docs/ADMIN-SETUP.md</code> ফাইলের ধাপগুলো শেষ হলে এখানে লগইন করা যাবে।</p>
        <Link to="/" className="adm-btn">← দোকানে ফিরুন</Link>
      </div>
    </div>
  )
}

function AdminLogin({ onDone, notAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr('ইমেইল বা পাসওয়ার্ড ভুল।')
    else onDone()
    setBusy(false)
  }
  return (
    <div className="adm-center">
      <form className="adm-card adm-narrow" onSubmit={submit}>
        <LogoIcon size={56} />
        <h1>Anaqia অ্যাডমিন</h1>
        {notAdmin && <p className="adm-error">এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই। অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।</p>}
        <label>ইমেইল<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>পাসওয়ার্ড<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <p className="adm-error">{err}</p>}
        <button className="adm-btn adm-block" disabled={busy}>{busy ? 'অপেক্ষা করুন...' : 'লগইন'}</button>
        <Link to="/" className="adm-muted">← দোকানে ফিরুন</Link>
      </form>
    </div>
  )
}

const NAV = [
  ['', '📊', 'ড্যাশবোর্ড'], ['orders', '🧾', 'অর্ডার'], ['products', '📦', 'পণ্য'],
  ['categories', '🗂️', 'ক্যাটাগরি'], ['coupons', '🎟️', 'কুপন'], ['settings', '⚙️', 'সেটিংস'],
]

export default function AdminApp() {
  const [state, setState] = useState('checking') // checking | out | notadmin | ok
  const [email, setEmail] = useState('')
  const [menu, setMenu] = useState(false)

  const check = async () => {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) return setState('out')
    setEmail(user.email)
    const { data: ok } = await supabase.rpc('is_admin')
    setState(ok ? 'ok' : 'notadmin')
  }
  useEffect(() => { if (isLive) check() }, [])

  if (!isLive) return <SetupNotice />
  if (state === 'checking') return <div className="adm-center"><p className="adm-muted">লোড হচ্ছে...</p></div>
  if (state !== 'ok') return <AdminLogin onDone={check} notAdmin={state === 'notadmin'} />

  return (
    <div className="adm">
      <aside className={`adm-side ${menu ? 'open' : ''}`}>
        <Link to="/admin" className="adm-brand"><LogoIcon size={34} /><span>anaqia <small>admin</small></span></Link>
        <nav>
          {NAV.map(([to, i, l]) => (
            <NavLink key={to} to={`/admin${to ? '/' + to : ''}`} end={!to} onClick={() => setMenu(false)}>{i} {l}</NavLink>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="#/" target="_blank" rel="noreferrer">🛍️ দোকান দেখুন</a>
          <span className="adm-muted small">{email}</span>
          <button onClick={async () => { await supabase.auth.signOut(); setState('out') }}>↩ লগআউট</button>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-menu" onClick={() => setMenu(!menu)} aria-label="মেনু">☰</button>
          <span>Anaqia অ্যাডমিন প্যানেল</span>
        </header>
        <div className="adm-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
