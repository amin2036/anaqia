import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Account() {
  const { t, fmt, num, user, logout, orders, wishlist, lang } = useStore()
  if (!user) return <Navigate to="/login" replace />
  const mine = orders.filter((o) => o.userEmail === user.email)
  return (
    <div className="container page">
      <div className="card account-head">
        <span className="avatar">{user.name?.[0]?.toUpperCase() || '🙂'}</span>
        <div><h1>{t('hello')}, {user.name}</h1><p className="muted">{user.email}</p></div>
        <div className="account-links">
          <Link to="/wishlist" className="btn btn-ghost btn-sm">♡ {t('wishlist')} ({num(wishlist.length)})</Link>
          <button className="btn btn-ghost btn-sm" onClick={logout}>{t('logout')}</button>
        </div>
      </div>
      <section className="section">
        <h2>{t('myOrders')}</h2>
        {mine.length === 0 ? <p className="empty">{t('noOrders')}</p> : (
          <div className="card table-wrap">
            <table className="orders">
              <thead><tr><th>ID</th><th>{t('date')}</th><th>{t('items')}</th><th>{t('total')}</th><th></th></tr></thead>
              <tbody>{mine.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.id}</b></td>
                  <td>{new Date(o.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</td>
                  <td>{num(o.items.reduce((s, i) => s + i.qty, 0))}</td>
                  <td>{fmt(o.total)}</td>
                  <td><Link to={`/track?id=${o.id}`}>{t('trackBtn')} →</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
