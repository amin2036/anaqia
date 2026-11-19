import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { tk, dt, STATUS, METHOD, errText } from './util.js'

function OrderDetail({ code, onClose, onSaved }) {
  const [o, setO] = useState(null)
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => {
    supabase.from('orders').select('*, order_items(*)').eq('code', code).maybeSingle().then(({ data }) => {
      setO(data); setStatus(data?.status || ''); setNote(data?.admin_note || '')
    })
  }, [code])
  const save = async () => {
    const { error } = await supabase.from('orders').update({ status, admin_note: note || null }).eq('id', o.id)
    if (error) return setMsg(errText(error))
    setMsg('✓ সেভ হয়েছে'); onSaved()
  }
  const phone = o?.phone?.replace(/^880/, '0') || ''
  return (
    <div className="adm-modal" onClick={onClose}>
      <div className="adm-card adm-modal-body" onClick={(e) => e.stopPropagation()}>
        {!o ? <p className="adm-muted">লোড হচ্ছে...</p> : (
          <>
            <div className="adm-head"><h2>অর্ডার {o.code}</h2><button className="adm-x" onClick={onClose}>✕</button></div>
            <p className="adm-muted small">{dt(o.created_at)}</p>
            <div className="adm-grid2 tight">
              <div>
                <h4>ক্রেতা</h4>
                <p><b>{o.customer_name}</b><br />{o.address}<br />{o.district}</p>
                <p>
                  <a className="adm-btn sm" href={`tel:${phone}`}>📞 {phone}</a>{' '}
                  <a className="adm-btn sm ghost" href={`https://wa.me/88${phone}`} target="_blank" rel="noreferrer">WhatsApp</a>
                </p>
                {o.note && <p className="adm-note">📝 {o.note}</p>}
              </div>
              <div>
                <h4>পেমেন্ট</h4>
                <p>{METHOD[o.payment_method]}{o.payment_ref && <><br /><small>নম্বর / TrxID: <b>{o.payment_ref}</b></small></>}</p>
                {(o.payment_method === 'bkash' || o.payment_method === 'nagad') && <p className="adm-muted small">⚠️ টাকা আপনার অ্যাকাউন্টে এসেছে কিনা মিলিয়ে তারপর কনফার্ম করুন।</p>}
              </div>
            </div>
            <table className="adm-table">
              <thead><tr><th>পণ্য</th><th>পরিমাণ</th><th>দাম</th></tr></thead>
              <tbody>{o.order_items.map((i) => (
                <tr key={i.id}>
                  <td className="adm-prod">{i.image && <img src={i.image} alt="" />}<span>{i.name}{(i.size || i.color) && <small className="adm-muted"><br />{[i.color, i.size].filter(Boolean).join(' · ')}</small>}</span></td>
                  <td>{i.qty}</td><td>{tk(i.price * i.qty)}</td>
                </tr>
              ))}</tbody>
            </table>
            <div className="adm-sum">
              <span>সাবটোটাল</span><b>{tk(o.subtotal)}</b>
              {o.discount > 0 && <><span>ছাড় ({o.coupon_code})</span><b>−{tk(o.discount)}</b></>}
              <span>ডেলিভারি</span><b>{tk(o.shipping)}</b>
              <span className="tot">সর্বমোট</span><b className="tot">{tk(o.total)}</b>
            </div>
            <div className="adm-form">
              <label>অর্ডারের অবস্থা
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.bn}</option>)}
                </select>
              </label>
              <label>নিজের নোট (ক্রেতা দেখবে না)<textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} /></label>
              {status === 'cancelled' && o.status !== 'cancelled' && <p className="adm-muted small">বাতিল করলে পণ্যগুলো আবার স্টকে যোগ হবে।</p>}
              <div className="adm-row"><button className="adm-btn" onClick={save}>সেভ করুন</button><button className="adm-btn ghost" onClick={() => window.print()}>🖨️ প্রিন্ট</button></div>
              {msg && <p className={msg.startsWith('✓') ? 'adm-ok' : 'adm-error'}>{msg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Orders() {
  const [params, setParams] = useSearchParams()
  const [rows, setRows] = useState(null)
  const [filter, setFilter] = useState('active')
  const [q, setQ] = useState('')
  const open = params.get('open')

  const load = async () => {
    let query = supabase.from('orders').select('id, code, customer_name, phone, district, total, status, payment_method, created_at').order('created_at', { ascending: false }).limit(200)
    if (filter === 'active') query = query.in('status', ['placed', 'confirmed', 'packed', 'shipped'])
    else if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setRows(data || [])
  }
  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const s = q.trim().toLowerCase()
  const shown = (rows || []).filter((o) => !s || o.code.toLowerCase().includes(s) || o.phone.includes(s) || o.customer_name.toLowerCase().includes(s))
  return (
    <>
      <div className="adm-head"><h1>অর্ডার</h1><button className="adm-btn ghost sm" onClick={load}>↻ রিফ্রেশ</button></div>
      <div className="adm-filters">
        {[['active', 'চলমান'], ...Object.entries(STATUS).map(([k, v]) => [k, v.bn]), ['all', 'সব']].map(([k, l]) => (
          <button key={k} className={`adm-chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
        <input className="adm-search" placeholder="অর্ডার আইডি, নাম বা ফোন খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="adm-card adm-scroll">
        {rows === null ? <p className="adm-muted">লোড হচ্ছে...</p> : shown.length === 0 ? <p className="adm-muted">কোনো অর্ডার নেই।</p> : (
          <table className="adm-table">
            <thead><tr><th>অর্ডার</th><th>ক্রেতা</th><th>মোট</th><th>পেমেন্ট</th><th>অবস্থা</th><th>সময়</th></tr></thead>
            <tbody>{shown.map((o) => (
              <tr key={o.id} className="click" onClick={() => setParams({ open: o.code })}>
                <td><b>{o.code}</b></td>
                <td>{o.customer_name}<br /><small className="adm-muted">{o.phone} · {o.district}</small></td>
                <td>{tk(o.total)}</td>
                <td>{METHOD[o.payment_method]}</td>
                <td><span className="adm-badge" style={{ '--c': STATUS[o.status].color }}>{STATUS[o.status].bn}</span></td>
                <td className="adm-muted small">{dt(o.created_at)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      {open && <OrderDetail code={open} onClose={() => setParams({})} onSaved={load} />}
    </>
  )
}
