import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function NotFound() {
  const { t } = useStore()
  return (
    <div className="container page empty-state">
      <span className="big-emoji">🛸</span>
      <h1>404 · {t('notFound')}</h1>
      <Link to="/" className="btn">{t('goHome')}</Link>
    </div>
  )
}
