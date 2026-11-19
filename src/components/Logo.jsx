import { useId } from 'react'

export function LogoIcon({ size = 36, mono = false }) {
  const id = useId().replace(/:/g, '')
  const fill = mono ? '#fff' : `url(#lg${id})`
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={`lg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#FF5C8A" />
        </linearGradient>
      </defs>
      <path d="M23 22v-5a9 9 0 0 1 18 0v5" fill="none" stroke={fill} strokeWidth="4.2" strokeLinecap="round" />
      <rect x="9" y="21" width="46" height="38" rx="13" fill={fill} />
      <path d="M23.5 51 32 31.5 40.5 51" fill="none" stroke={mono ? '#8B5CF6' : '#fff'} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27.2 44.2h9.6" stroke={mono ? '#8B5CF6' : '#fff'} strokeWidth="4" strokeLinecap="round" />
      <path d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6z" fill={mono ? '#fff' : '#FF5C8A'} />
    </svg>
  )
}

export default function Logo({ size = 36, tagline = false }) {
  return (
    <span className="logo">
      <LogoIcon size={size} />
      <span className="logo-text">
        <b>anaqia</b>
        {tagline && <small>Everything You Love</small>}
      </span>
    </span>
  )
}
