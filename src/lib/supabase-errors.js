// Turns Supabase error codes raised by the database into friendly keys.
export function errorKey(err) {
  const m = (err?.message || '').toLowerCase()
  if (m.includes('invalid_phone')) return 'errPhone'
  if (m.includes('out_of_stock')) return 'errStock'
  if (m.includes('missing_fields')) return 'required'
  if (m.includes('empty_cart')) return 'emptyCart'
  return 'errGeneric'
}
