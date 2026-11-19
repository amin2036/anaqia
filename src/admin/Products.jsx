import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { tk, errText } from './util.js'

export default function Products() {
  const [rows, setRows] = useState(null)
  const [cats, setCats] = useState([])
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')
  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('id, name_bn, name_en, category_id, price, old_price, stock, images, emoji, active, sort').order('sort'),
      supabase.from('categories').select('id, name_bn').order('sort'),
    ])
    setRows(p || []); setCats(c || [])
  }
  useEffect(() => { load() }, [])
  const toggle = async (p) => {
    const { error } = await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    if (error) setMsg(errText(error)); else load()
  }
  const s = q.trim().toLowerCase()
  const shown = (rows || []).filter((p) => (!cat || p.category_id === cat) && (!s || p.name_bn.includes(q.trim()) || p.name_en.toLowerCase().includes(s) || p.id.includes(s)))
  const catName = (id) => cats.find((c) => c.id === id)?.name_bn || id
  return (
    <>
      <div className="adm-head"><h1>পণ্য</h1><Link to="/admin/products/new" className="adm-btn">+ নতুন পণ্য</Link></div>
      <div className="adm-filters">
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">সব ক্যাটাগরি</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name_bn}</option>)}
        </select>
        <input className="adm-search" placeholder="পণ্যের নাম খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {msg && <p className="adm-error">{msg}</p>}
      <div className="adm-card adm-scroll">
        {rows === null ? <p className="adm-muted">লোড হচ্ছে...</p> : shown.length === 0 ? <p className="adm-muted">কোনো পণ্য নেই।</p> : (
          <table className="adm-table">
            <thead><tr><th>পণ্য</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>ছবি</th><th>দেখাবে</th><th></th></tr></thead>
            <tbody>{shown.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'faded'}>
                <td className="adm-prod">{p.images?.[0] ? <img src={p.images[0].startsWith('http') ? p.images[0] : '/' + p.images[0]} alt="" /> : <span className="adm-emoji">{p.emoji}</span>}<span><b>{p.name_bn}</b><br /><small className="adm-muted">{p.name_en}</small></span></td>
                <td>{catName(p.category_id)}</td>
                <td>{tk(p.price)}{p.old_price > p.price && <><br /><s className="adm-muted small">{tk(p.old_price)}</s></>}</td>
                <td className={p.stock <= 5 ? 'adm-error' : ''}><b>{p.stock}</b></td>
                <td>{p.images?.length || 0}</td>
                <td><button className={`adm-switch ${p.active ? 'on' : ''}`} onClick={() => toggle(p)} aria-label="দেখাবে কিনা"><span /></button></td>
                <td><Link to={`/admin/products/${p.id}`} className="adm-btn sm ghost">এডিট</Link></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </>
  )
}
