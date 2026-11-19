import { useState } from 'react'

// Renders the image; if the file is missing or fails to load, renders `fallback` instead.
export default function SmartImg({ src, alt = '', className, fallback = null, ...rest }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />
}
