import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { tk, dt, STATUS } from './util.js'

export default function Dashboard() {
  const [s, setS] = useState(null)
  const [recent, setRecent] = useState([])
  const [err, setErr] = useState('')
  useEffect(() => {
    supabase.rpc('admin_stats').then(({ data, error }) => (error ? setErr(error.message) : setS(data)))
    supabase.from('orders').select('code, customer_name, total, status, created_at').order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => setRecent(data || []))
  }, [])
  if (err) return <p className="adm-error">{err}</p>
  if (!s) return <p className="adm-muted">লোড হচ্ছে...</p>
  const cards = [
    ['আজকের বিক্রি', tk(s.today_sales), `${s.today_orders}টি অর্ডার`],
    ['গত ৭ দিন', tk(s.week_sales), ''],
    ['গত ৩০ দিন', tk(s.month_sales), `${s.month_orders}টি অর্ডার`],
    ['অপেক্ষমাণ অর্ডার', s.pending, 'নতুন, কনফার্ম বা প্যাক করা'],
  ]
  return (
    <>
      <h1>ড্যাশবোর্ড</h1>
      <div className="adm-stats">
        {cards.map(([l, v, sub]) => (
          <div key={l} className="adm-card adm-stat"><span>{l}</span><b>{v}</b>{sub && <small>{sub}</small>}</div>
        ))}
      </div>
      <div className="adm-grid2">
        <div className="adm-card">
          <div className="adm-head"><h2>সাম্প্রতিক অর্ডার</h2><Link to="/admin/orders">সব দেখুন →</Link></div>
          {recent.length === 0 ? <p className="adm-muted">এখনো কোনো অর্ডার আসেনি।</p> : (
            <table className="adm-table"><tbody>
              {recent.map((o) => (
                <tr key={o.code}>
                  <td><Link to={`/admin/orders?open=${o.code}`}><b>{o.code}</b></Link><br /><small className="adm-muted">{o.customer_name}</small></td>
                  <td>{tk(o.total)}</td>
                  <td><span className="adm-badge" style={{ '--c': STATUS[o.status].color }}>{STATUS[o.status].bn}</span></td>
                  <td className="adm-muted small">{dt(o.created_at)}</td>
                </tr>
              ))}
            </tbody></table>
          )}
        </div>
        <div className="adm-card">
          <div className="adm-head"><h2>স্টক কম ⚠️</h2><Link to="/admin/products">পণ্য →</Link></div>
          {s.low_stock.length === 0 ? <p className="adm-muted">সব পণ্যের স্টক ঠিক আছে (৫টির বেশি)।</p> : (
            <table className="adm-table"><tbody>
              {s.low_stock.map((p) => (
                <tr key={p.id}><td><Link to={`/admin/products/${p.id}`}>{p.name}</Link></td><td className={p.stock === 0 ? 'adm-error' : ''}><b>{p.stock}</b> টি</td></tr>
              ))}
            </tbody></table>
          )}
          <p className="adm-muted small">মোট পণ্য: {s.products}টি</p>
        </div>
      </div>
    </>
  )
}
