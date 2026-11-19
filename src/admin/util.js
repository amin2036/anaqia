export const tk = (n) => '৳' + new Intl.NumberFormat('en-IN').format(Math.round(n || 0))
export const dt = (d) => new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
export const STATUS = {
  placed: { bn: 'নতুন অর্ডার', color: '#3B82F6' },
  confirmed: { bn: 'কনফার্ম', color: '#8B5CF6' },
  packed: { bn: 'প্যাক করা', color: '#F59E0B' },
  shipped: { bn: 'পাঠানো হয়েছে', color: '#06B6D4' },
  delivered: { bn: 'ডেলিভারি সম্পন্ন', color: '#10B981' },
  cancelled: { bn: 'বাতিল', color: '#EF4444' },
}
export const METHOD = { cod: 'ক্যাশ অন ডেলিভারি', bkash: 'বিকাশ', nagad: 'নগদ', card: 'কার্ড' }
export const list = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)
export const errText = (e) => {
  const m = e?.message || String(e)
  if (m.includes('violates foreign key')) return 'এটি মুছা যাবে না, কারণ এর সাথে অন্য তথ্য যুক্ত আছে (যেমন ক্যাটাগরিতে পণ্য আছে)।'
  if (m.includes('duplicate key')) return 'এই আইডি/কোড আগে থেকেই আছে। অন্য একটি দিন।'
  if (m.includes('check constraint')) return 'কিছু তথ্য সঠিক নয়। আইডিতে শুধু ইংরেজি ছোট অক্ষর, সংখ্যা আর - দিন।'
  return 'ভুল হয়েছে: ' + m
}
