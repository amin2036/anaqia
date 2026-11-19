import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { errText } from './util.js'

export default function Settings() {
  const [f, setF] = useState(null)
  const [msg, setMsg] = useState('')
  useEffect(() => { supabase.from('settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => setF(data)) }, [])
  if (!f) return <p className="adm-muted">লোড হচ্ছে...</p>
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    const row = { ...f, delivery_inside: Number(f.delivery_inside), delivery_outside: Number(f.delivery_outside), free_over: Number(f.free_over) }
    const { error } = await supabase.from('settings').update(row).eq('id', 1)
    setMsg(error ? errText(error) : '✓ সেভ হয়েছে। দোকানে নতুন তথ্য দেখাতে পেজটি একবার রিফ্রেশ করুন।')
  }
  return (
    <form onSubmit={save}>
      <h1>সেটিংস</h1>
      <div className="adm-grid2">
        <div className="adm-card adm-form">
          <h2>🚚 ডেলিভারি চার্জ</h2>
          <label>ঢাকার ভেতরে (৳)<input type="number" min="0" value={f.delivery_inside} onChange={set('delivery_inside')} /></label>
          <label>ঢাকার বাইরে (৳)<input type="number" min="0" value={f.delivery_outside} onChange={set('delivery_outside')} /></label>
          <label>এর বেশি অর্ডারে ফ্রি ডেলিভারি (৳)<input type="number" min="0" value={f.free_over} onChange={set('free_over')} /></label>
        </div>
        <div className="adm-card adm-form">
          <h2>📞 দোকানের তথ্য</h2>
          <label>ফোন<input value={f.store_phone} onChange={set('store_phone')} /></label>
          <label>ইমেইল<input type="email" value={f.store_email} onChange={set('store_email')} /></label>
          <label>ঠিকানা<input value={f.store_address} onChange={set('store_address')} /></label>
          <label>বিকাশ মার্চেন্ট/পার্সোনাল নম্বর<input value={f.bkash_number} onChange={set('bkash_number')} placeholder="01XXXXXXXXX" /></label>
          <label>নগদ নম্বর<input value={f.nagad_number} onChange={set('nagad_number')} placeholder="01XXXXXXXXX" /></label>
        </div>
        <div className="adm-card adm-form">
          <h2>🔗 সোশ্যাল মিডিয়া লিংক</h2>
          <p className="adm-muted small">যেগুলো দেবেন শুধু সেগুলোই দোকানের নিচে (ফুটার) আর যোগাযোগ পেজে দেখাবে। পুরো লিংক দিন (https:// দিয়ে শুরু)।</p>
          <label>Facebook<input type="url" value={f.facebook_url || ''} onChange={set('facebook_url')} placeholder="https://www.facebook.com/..." /></label>
          <label>Instagram<input type="url" value={f.instagram_url || ''} onChange={set('instagram_url')} placeholder="https://www.instagram.com/..." /></label>
          <label>YouTube<input type="url" value={f.youtube_url || ''} onChange={set('youtube_url')} placeholder="https://www.youtube.com/@..." /></label>
          <label>TikTok<input type="url" value={f.tiktok_url || ''} onChange={set('tiktok_url')} placeholder="https://www.tiktok.com/@..." /></label>
        </div>
      </div>
      {msg && <p className={msg.startsWith('✓') ? 'adm-ok' : 'adm-error'}>{msg}</p>}
      <button className="adm-btn">সেভ করুন</button>
    </form>
  )
}
