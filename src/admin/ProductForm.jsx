import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { uploadImage } from '../lib/upload.js'
import { slugify } from '../lib/catalog.js'
import { list, errText } from './util.js'

const EMPTY = {
  id: '', category_id: '', name_en: '', name_bn: '', description_en: '', description_bn: '',
  price: '', old_price: '', stock: 10, emoji: '🛍️', images: [], sizes: '', colors: '', badge: '',
  featured: false, flash: false, trending: false, rating: 4.5, reviews: 0, active: true, sort: 0,
}
const src = (u) => (u.startsWith('http') ? u : '/' + u)

export default function ProductForm() {
  const { id } = useParams()
  const isNew = !id
  const nav = useNavigate()
  const [f, setF] = useState(EMPTY)
  const [cats, setCats] = useState([])
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [msg, setMsg] = useState('')
  const [idTouched, setIdTouched] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('id, name_bn').order('sort').then(({ data }) => {
      setCats(data || [])
      if (isNew && data?.[0]) setF((x) => ({ ...x, category_id: x.category_id || data[0].id }))
    })
    if (!isNew) {
      supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
        if (!data) return setMsg('পণ্যটি পাওয়া যায়নি।')
        setF({
          ...data, old_price: data.old_price ?? '', badge: data.badge || '',
          sizes: data.sizes.join(', '), colors: data.colors.join(', '),
          featured: data.tags.includes('recommended'), flash: data.tags.includes('flash'), trending: data.tags.includes('trending'),
        })
      })
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setF((x) => ({ ...x, [k]: v, ...(k === 'name_en' && isNew && !idTouched ? { id: slugify(v) } : {}) }))
  }

  const onFiles = async (files) => {
    const arr = [...files]
    setUploading(arr.length); setMsg('')
    try {
      for (const file of arr) {
        const url = await uploadImage(file, 'products')
        setF((x) => ({ ...x, images: [...x.images, url] }))
        setUploading((n) => n - 1)
      }
    } catch (e) {
      setMsg('ছবি আপলোড হয়নি: ' + e.message)
    }
    setUploading(0)
  }
  const moveImg = (i, d) => setF((x) => {
    const a = [...x.images]; const j = i + d
    if (j < 0 || j >= a.length) return x
    ;[a[i], a[j]] = [a[j], a[i]]
    return { ...x, images: a }
  })
  const removeImg = (i) => setF((x) => ({ ...x, images: x.images.filter((_, k) => k !== i) }))

  const save = async (e) => {
    e.preventDefault()
    if (!f.id || !/^[a-z0-9-]+$/.test(f.id)) return setMsg('আইডিতে শুধু ইংরেজি ছোট অক্ষর, সংখ্যা আর - দিন (যেমন blue-sneakers)।')
    setBusy(true); setMsg('')
    const tags = [f.featured && 'recommended', f.flash && 'flash', f.trending && 'trending'].filter(Boolean)
    const row = {
      id: f.id, category_id: f.category_id, name_en: f.name_en.trim(), name_bn: f.name_bn.trim(),
      description_en: f.description_en, description_bn: f.description_bn,
      price: Number(f.price), old_price: f.old_price === '' ? null : Number(f.old_price), stock: Number(f.stock),
      emoji: f.emoji || '🛍️', images: f.images, sizes: list(f.sizes), colors: list(f.colors), badge: f.badge || null,
      tags, rating: Number(f.rating), reviews: Number(f.reviews), active: f.active, sort: Number(f.sort) || 0,
    }
    const { error } = isNew ? await supabase.from('products').insert(row) : await supabase.from('products').update(row).eq('id', id)
    setBusy(false)
    if (error) return setMsg(errText(error))
    nav('/admin/products')
  }
  const del = async () => {
    if (!confirm('এই পণ্যটি পুরোপুরি মুছে ফেলবেন? এটা ফেরানো যাবে না। শুধু লুকাতে চাইলে "দোকানে দেখাবে" বন্ধ করুন।')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return setMsg(errText(error))
    nav('/admin/products')
  }

  return (
    <form onSubmit={save}>
      <div className="adm-head"><h1>{isNew ? 'নতুন পণ্য' : 'পণ্য এডিট'}</h1><Link to="/admin/products" className="adm-muted">← সব পণ্য</Link></div>
      <div className="adm-grid2 wide">
        <div className="adm-card adm-form">
          <h2>তথ্য</h2>
          <label>নাম (বাংলা) *<input required value={f.name_bn} onChange={set('name_bn')} /></label>
          <label>নাম (English) *<input required value={f.name_en} onChange={set('name_en')} /></label>
          <label>আইডি (লিংকে দেখাবে) *<input required value={f.id} disabled={!isNew} onChange={(e) => { setIdTouched(true); setF((x) => ({ ...x, id: e.target.value })) }} placeholder="blue-sneakers" /></label>
          <label>ক্যাটাগরি *
            <select required value={f.category_id} onChange={set('category_id')}>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name_bn}</option>)}
            </select>
          </label>
          <div className="adm-row3">
            <label>দাম (৳) *<input required type="number" min="0" value={f.price} onChange={set('price')} /></label>
            <label>আগের দাম (৳)<input type="number" min="0" value={f.old_price} onChange={set('old_price')} placeholder="ছাড় দেখাতে" /></label>
            <label>স্টক *<input required type="number" min="0" value={f.stock} onChange={set('stock')} /></label>
          </div>
          <label>বিবরণ (বাংলা)<textarea rows="4" value={f.description_bn} onChange={set('description_bn')} /></label>
          <label>বিবরণ (English)<textarea rows="4" value={f.description_en} onChange={set('description_en')} /></label>
          <label>সাইজ (কমা দিয়ে আলাদা)<input value={f.sizes} onChange={set('sizes')} placeholder="40, 41, 42, 43" /></label>
          <label>রঙ (কমা দিয়ে আলাদা)<input value={f.colors} onChange={set('colors')} placeholder="কালো, সাদা, নীল" /></label>
        </div>
        <div className="adm-col">
          <div className="adm-card adm-form">
            <h2>ছবি</h2>
            <p className="adm-muted small">যত খুশি ছবি দিন (বিভিন্ন দিক থেকে)। প্রথম ছবিটাই প্রধান ছবি হিসেবে দেখাবে। ছবি নিজে থেকেই ছোট হয়ে আপলোড হবে।</p>
            <div className="adm-images">
              {f.images.map((u, i) => (
                <div key={u + i} className="adm-img">
                  <img src={src(u)} alt="" />
                  {i === 0 && <span className="adm-main-tag">প্রধান</span>}
                  <div className="adm-img-tools">
                    <button type="button" onClick={() => moveImg(i, -1)} disabled={i === 0}>◀</button>
                    <button type="button" onClick={() => removeImg(i)}>🗑</button>
                    <button type="button" onClick={() => moveImg(i, 1)} disabled={i === f.images.length - 1}>▶</button>
                  </div>
                </div>
              ))}
              <label className="adm-upload">
                <input type="file" accept="image/*" multiple onChange={(e) => { onFiles(e.target.files); e.target.value = '' }} />
                <span>{uploading ? `আপলোড হচ্ছে (${uploading})...` : '+ ছবি যোগ করুন'}</span>
              </label>
            </div>
          </div>
          <div className="adm-card adm-form">
            <h2>দোকানে কোথায় দেখাবে</h2>
            <label className="adm-check"><input type="checkbox" checked={f.active} onChange={set('active')} /> দোকানে দেখাবে</label>
            <label className="adm-check"><input type="checkbox" checked={f.flash} onChange={set('flash')} /> 🔥 ফ্ল্যাশ ডিল</label>
            <label className="adm-check"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> ⭐ আপনার জন্য বাছাই (হোমপেজ)</label>
            <label className="adm-check"><input type="checkbox" checked={f.trending} onChange={set('trending')} /> 📈 এখন ট্রেন্ডিং</label>
            <div className="adm-row3">
              <label>ব্যাজ
                <select value={f.badge} onChange={set('badge')}><option value="">নেই</option><option value="new">NEW</option><option value="hot">HOT</option></select>
              </label>
              <label>আইকন<input value={f.emoji} onChange={set('emoji')} maxLength="4" /></label>
              <label>ক্রম<input type="number" value={f.sort} onChange={set('sort')} /></label>
            </div>
            <div className="adm-row3">
              <label>রেটিং<input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={set('rating')} /></label>
              <label>রিভিউ সংখ্যা<input type="number" min="0" value={f.reviews} onChange={set('reviews')} /></label>
            </div>
          </div>
        </div>
      </div>
      {msg && <p className="adm-error">{msg}</p>}
      <div className="adm-row adm-sticky">
        <button className="adm-btn" disabled={busy || uploading > 0}>{busy ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</button>
        <Link to="/admin/products" className="adm-btn ghost">বাতিল</Link>
        {!isNew && <button type="button" className="adm-btn danger" onClick={del}>মুছে ফেলুন</button>}
      </div>
    </form>
  )
}
