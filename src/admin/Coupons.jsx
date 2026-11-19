import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { tk, errText } from './util.js'

const EMPTY = { code: '', type: 'percent', value: 10, min_order: 0, active: true, expires_at: '' }

export default function Coupons() {
  const [rows, setRows] = useState(null)
  const [f, setF] = useState(EMPTY)
  const [msg, setMsg] = useState('')
  const load = () => supabase.from('coupons').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const add = async (e) => {
    e.preventDefault(); setMsg('')
    const row = { code: f.code.trim().toUpperCase().replace(/\s/g, ''), type: f.type, value: Number(f.value), min_order: Number(f.min_order) || 0, active: true, expires_at: f.expires_at ? new Date(f.expires_at + 'T23:59:59').toISOString() : null }
    if (row.type === 'percent' && row.value > 90) return setMsg('শতাংশ ছাড় ৯০% এর বেশি দেওয়া যাবে না।')
    const { error } = await supabase.from('coupons').insert(row)
    if (error) return setMsg(errText(error))
    setF(EMPTY); load()
  }
  const toggle = async (c) => { await supabase.from('coupons').update({ active: !c.active }).eq('code', c.code); load() }
  const del = async (c) => { if (confirm(`কুপন ${c.code} মুছবেন?`)) { await supabase.from('coupons').delete().eq('code', c.code); load() } }
  return (
    <>
      <h1>কুপন</h1>
      <form className="adm-card adm-form" onSubmit={add}>
        <h2>নতুন কুপন</h2>
        <div className="adm-row3">
          <label>কোড *<input required value={f.code} onChange={set('code')} placeholder="EID25" /></label>
          <label>ধরন
            <select value={f.type} onChange={set('type')}><option value="percent">শতাংশ (%)</option><option value="flat">নির্দিষ্ট টাকা (৳)</option></select>
          </label>
          <label>ছাড় *<input required type="number" min="1" value={f.value} onChange={set('value')} /></label>
        </div>
        <div className="adm-row3">
          <label>ন্যূনতম অর্ডার (৳)<input type="number" min="0" value={f.min_order} onChange={set('min_order')} /></label>
          <label>শেষ তারিখ (ঐচ্ছিক)<input type="date" value={f.expires_at} onChange={set('expires_at')} /></label>
        </div>
        {msg && <p className="adm-error">{msg}</p>}
        <div><button className="adm-btn">কুপন যোগ করুন</button></div>
      </form>
      <div className="adm-card adm-scroll">
        {rows === null ? <p className="adm-muted">লোড হচ্ছে...</p> : rows.length === 0 ? <p className="adm-muted">কোনো কুপন নেই।</p> : (
          <table className="adm-table">
            <thead><tr><th>কোড</th><th>ছাড়</th><th>ন্যূনতম</th><th>শেষ তারিখ</th><th>চালু</th><th></th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.code} className={c.active ? '' : 'faded'}>
                <td><b>{c.code}</b></td>
                <td>{c.type === 'percent' ? `${c.value}%` : tk(c.value)}</td>
                <td>{tk(c.min_order)}</td>
                <td className="adm-muted">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-GB') : 'নেই'}</td>
                <td><button className={`adm-switch ${c.active ? 'on' : ''}`} onClick={() => toggle(c)} aria-label="চালু"><span /></button></td>
                <td><button className="adm-btn sm danger" onClick={() => del(c)}>মুছুন</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </>
  )
}
