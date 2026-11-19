import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { LogoIcon } from '../components/Logo.jsx'

export default function Login() {
  const { t, user, login, register } = useStore()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const nav = useNavigate()
  if (user) return <Navigate to="/account" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (mode === 'login') { if (login(f)) nav('/account'); else setErr(t('wrongLogin')) }
    else { if (register(f)) nav('/account'); else setErr(t('exists')) }
  }
  return (
    <div className="container page narrow">
      <form className="card auth-card" onSubmit={submit}>
        <LogoIcon size={64} />
        <h1>{mode === 'login' ? t('loginTitle') : t('registerTitle')}</h1>
        {mode === 'register' && <label>{t('name')}<input required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>{t('password')}<input type="password" required minLength="4" value={f.password} onChange={set('password')} /></label>
        {err && <p className="error small">{err}</p>}
        <button className="btn btn-block">{mode === 'login' ? t('login') : t('register')}</button>
        <p className="muted small">
          {mode === 'login' ? t('noAccount') : t('haveAccount')}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr('') }}>
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </p>
      </form>
    </div>
  )
}
