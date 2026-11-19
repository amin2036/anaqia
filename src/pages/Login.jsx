import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { LogoIcon } from '../components/Logo.jsx'

export default function Login() {
  const { t, user, login, register } = useStore()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  if (user) return <Navigate to="/account" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr(''); setInfo('')
    if (mode === 'login') {
      if (await login(f)) nav('/account'); else setErr(t('wrongLogin'))
    } else {
      const r = await register(f)
      if (r === 'ok') nav('/account')
      else if (r === 'confirm') setInfo(t('checkEmail'))
      else setErr(t(r === 'exists' ? 'exists' : 'errGeneric'))
    }
    setBusy(false)
  }
  return (
    <div className="container page narrow">
      <form className="card auth-card" onSubmit={submit}>
        <LogoIcon size={64} />
        <h1>{mode === 'login' ? t('loginTitle') : t('registerTitle')}</h1>
        {mode === 'register' && <label>{t('name')}<input required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>{t('password')}<input type="password" required minLength="6" value={f.password} onChange={set('password')} /></label>
        {err && <p className="error small">{err}</p>}
        {info && <p className="success small">{info}</p>}
        <button className="btn btn-block" disabled={busy}>{busy ? t('loading') : mode === 'login' ? t('login') : t('register')}</button>
        <p className="muted small">
          {mode === 'login' ? t('noAccount') : t('haveAccount')}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); setInfo('') }}>
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </p>
      </form>
    </div>
  )
}
