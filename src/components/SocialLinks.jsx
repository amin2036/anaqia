import { useStore } from '../context/StoreContext.jsx'

// Social profile links from admin Settings. Only links that are filled in are shown.
const ICONS = {
  facebook_url: ['Facebook', 'M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H8v3.2h2.6V20h3.4v-8.3h2.6l.4-3.2H14z'],
  instagram_url: ['Instagram', 'M12 7.4A4.6 4.6 0 1 0 12 16.6 4.6 4.6 0 0 0 12 7.4zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.8-8.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.6c2.3 0 2.6 0 3.5.1 2.3.1 3.4 1.2 3.5 3.5.1.9.1 1.2.1 3.5v2.6c0 2.3 0 2.6-.1 3.5-.1 2.3-1.2 3.4-3.5 3.5-.9.1-1.2.1-3.5.1s-2.6 0-3.5-.1c-2.3-.1-3.4-1.2-3.5-3.5-.1-.9-.1-1.2-.1-3.5v-2.6c0-2.3 0-2.6.1-3.5.1-2.3 1.2-3.4 3.5-3.5.9-.1 1.2-.1 3.5-.1z'],
  youtube_url: ['YouTube', 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z'],
  tiktok_url: ['TikTok', 'M16.6 3h-3v11.6a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9a5.7 5.7 0 1 0 4.8 5.6V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4A4.3 4.3 0 0 1 16.6 3z'],
}

export default function SocialLinks({ className = 'socials' }) {
  const { settings } = useStore()
  const links = Object.entries(ICONS).filter(([k]) => /^https?:\/\//.test(settings[k] || ''))
  if (links.length === 0) return null
  return (
    <div className={className}>
      {links.map(([k, [label, d]]) => (
        <a key={k} href={settings[k]} target="_blank" rel="noreferrer" className="social" aria-label={label} title={label}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d={d} /></svg>
        </a>
      ))}
    </div>
  )
}
