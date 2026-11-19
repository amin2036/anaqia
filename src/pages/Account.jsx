import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Account() {
  const { t, fmt, num, user, logout, wishlist, lang, fetchMyOrders } = useStore()
  const [orders, setOrders] = useState(null)
  useEffect(() => { if (user) fetchMyOrders().then(setOrders) }, [user?.email]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!user) return <Navigate to="/login" replace />
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
        {orders === null ? <p className="empty">{t('loading')}</p> : orders.length === 0 ? <p className="empty">{t('noOrders')}</p> : (
          <div className="card table-wrap">
            <table className="orders">
              <thead><tr><th>ID</th><th>{t('date')}</th><th>{t('items')}</th><th>{t('total')}</th><th>{t('status')}</th><th></th></tr></thead>
              <tbody>{orders.map((o) => (
                <tr key={o.code}>
                  <td><b>{o.code}</b></td>
                  <td>{new Date(o.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</td>
                  <td>{num(o.qty)}</td>
                  <td>{fmt(o.total)}</td>
                  <td>{t('status_' + o.status)}</td>
                  <td><Link to={`/track?id=${o.code}`}>{t('trackBtn')} →</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
