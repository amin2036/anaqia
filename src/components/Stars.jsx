import { useStore } from '../context/StoreContext.jsx'

export default function Stars({ rating, reviews }) {
  const { num } = useStore()
  return (
    <span className="stars">
      <span className="star">★</span> {num(rating)}
      {reviews != null && <span className="muted"> ({num(reviews)})</span>}
    </span>
  )
}
