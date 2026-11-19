import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

// Counts down to the end of the current day.
export default function Countdown() {
  const { t, num } = useStore()
  const left = () => {
    const end = new Date(); end.setHours(23, 59, 59, 999)
    return Math.max(0, end - Date.now())
  }
  const [ms, setMs] = useState(left)
  useEffect(() => { const id = setInterval(() => setMs(left()), 1000); return () => clearInterval(id) }, [])
  const parts = [
    [Math.floor(ms / 3.6e6), t('hrs')],
    [Math.floor(ms / 6e4) % 60, t('mins')],
    [Math.floor(ms / 1000) % 60, t('secs')],
  ]
  return (
    <div className="countdown">
      {parts.map(([v, l]) => (
        <div key={l} className="cd-box"><b>{String(v).padStart(2, '0').split('').map((d) => num(Number(d))).join('')}</b><small>{l}</small></div>
      ))}
    </div>
  )
}
