import { supabase, IMAGE_BUCKET } from './supabase.js'

// Shrinks a photo in the browser (max 1400px, JPEG) before uploading, so phone
// photos of several MB become ~200 KB and the shop stays fast.
async function compress(file, max = 1400, quality = 0.85) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality))
  return blob || file
}

export async function uploadImage(file, folder = 'products') {
  const body = await compress(file)
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, body, { contentType: 'image/jpeg', cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}
