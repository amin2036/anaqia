import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadImage } from '../lib/upload.js'
import { slugify } from '../lib/catalog.js'
import { errText } from './util.js'

const EMPTY = { id: '', name_bn: '', name_en: '', emoji: '🛍️', hue: '#8B5CF6', image_url: '', sort: 0, active: true }

export default function Categories() {
  const [rows, setRows] = useState(null)
  const [counts, setCounts] = useState({})
  const [edit, setEdit] = useState(null) // row being edited, or EMPTY for new
  const [isNew, setIsNew] = useState(false)
  const [msg, setMsg] = useState('')
  const load = async () => {
    const [{ data: c }, { data: p }] = await Promise.all([
      supabase.from('categories').select('*').order('sort'),
      supabase.from('products').select('category_id'),
    ])
    setRows(c || [])
    const n = {}; (p || []).forEach((x) => { n[x.category_id] = (n[x.category_id] || 0) + 1 }); setCounts(n)
  }
  useEffect(() => { load() }, [])
  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setEdit((x) => ({ ...x, [k]: v, ...(k === 'name_en' && isNew ? { id: slugify(v) } : {}) }))
  }
  const save = async (e) => {
    e.preventDefault(); setMsg('')
    const row = { ...edit, sort: Number(edit.sort) || 0, image_url: edit.image_url || null }
    delete row.created_at
    const { error } = isNew ? await supabase.from('categories').insert(row) : await supabase.from('categories').update(row).eq('id', edit.id)
    if (error) return setMsg(errText(error))
    setEdit(null); load()
  }
  const del = async (c) => {
    if (counts[c.id]) return setMsg(`"${c.name_bn}" এ ${counts[c.id]}টি পণ্য আছে। আগে পণ্যগুলো অন্য ক্যাটাগরিতে সরান, অথবা ক্যাটাগরিটি লুকিয়ে রাখুন।`)
    if (!confirm(`"${c.name_bn}" ক্যাটাগরিটি মুছে ফেলবেন?`)) return
    const { error } = await supabase.from('categories').delete().eq('id', c.id)
    if (error) setMsg(errText(error)); else load()
  }
  const onImage = async (file) => {
    try { const url = await uploadImage(file, 'categories'); setEdit((x) => ({ ...x, image_url: url })) }
    catch (e) { setMsg('ছবি আপলোড হয়নি: ' + e.message) }
  }
  return (
    <>
      <div className="adm-head"><h1>ক্যাটাগরি</h1><button className="adm-btn" onClick={() => { setEdit({ ...EMPTY, sort: (rows?.length || 0) }); setIsNew(true) }}>+ নতুন ক্যাটাগরি</button></div>
      {msg && <p className="adm-error">{msg}</p>}
      {edit && (
        <form className="adm-card adm-form" onSubmit={save}>
          <h2>{isNew ? 'নতুন ক্যাটাগরি' : 'ক্যাটাগরি এডিট'}</h2>
          <div className="adm-row3">
            <label>নাম (বাংলা) *<input required value={edit.name_bn} onChange={set('name_bn')} /></label>
            <label>নাম (English) *<input required value={edit.name_en} onChange={set('name_en')} /></label>
            <label>আইডি *<input required value={edit.id} disabled={!isNew} onChange={set('id')} placeholder="books" /></label>
          </div>
          <div className="adm-row3">
            <label>আইকন<input value={edit.emoji} onChange={set('emoji')} maxLength="4" /></label>
            <label>রঙ<input type="color" value={edit.hue} onChange={set('hue')} /></label>
            <label>ক্রম<input type="number" value={edit.sort} onChange={set('sort')} /></label>
          </div>
          <div className="adm-row">
            {edit.image_url && <img className="adm-cat-img" src={edit.image_url} alt="" />}
            <label className="adm-btn ghost sm">ছবি দিন (ঐচ্ছিক)<input hidden type="file" accept="image/*" onChange={(e) => e.target.files[0] && onImage(e.target.files[0])} /></label>
            {edit.image_url && <button type="button" className="adm-btn ghost sm" onClick={() => setEdit((x) => ({ ...x, image_url: '' }))}>ছবি সরান</button>}
          </div>
          <label className="adm-check"><input type="checkbox" checked={edit.active} onChange={set('active')} /> দোকানে দেখাবে</label>
          <div className="adm-row"><button className="adm-btn">সেভ করুন</button><button type="button" className="adm-btn ghost" onClick={() => setEdit(null)}>বাতিল</button></div>
        </form>
      )}
      <div className="adm-card adm-scroll">
        {rows === null ? <p className="adm-muted">লোড হচ্ছে...</p> : (
          <table className="adm-table">
            <thead><tr><th>ক্যাটাগরি</th><th>আইডি</th><th>পণ্য</th><th>ক্রম</th><th></th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id} className={c.active ? '' : 'faded'}>
                <td className="adm-prod">{c.image_url ? <img src={c.image_url} alt="" /> : <span className="adm-emoji" style={{ background: c.hue + '22' }}>{c.emoji}</span>}<span><b>{c.name_bn}</b><br /><small className="adm-muted">{c.name_en}</small></span></td>
                <td className="adm-muted">{c.id}</td>
                <td>{counts[c.id] || 0}</td>
                <td>{c.sort}</td>
                <td className="adm-row"><button className="adm-btn sm ghost" onClick={() => { setEdit(c); setIsNew(false) }}>এডিট</button><button className="adm-btn sm danger" onClick={() => del(c)}>মুছুন</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </>
  )
}
