import { categoryOf } from '../data/products.js'

// Shows the product photo when `image` is set, otherwise a glowing icon card.
export default function ProductVisual({ product, size = 'md' }) {
  const hue = categoryOf(product.cat)?.hue || '#8B5CF6'
  if (product.image) {
    return <div className={`pv pv-${size}`}><img src={product.image} alt="" loading="lazy" /></div>
  }
  return (
    <div className={`pv pv-${size}`} style={{ '--hue': hue }}>
      <span className="pv-glow" />
      <span className="pv-ring" />
      <span className="pv-emoji" aria-hidden="true">{product.emoji}</span>
    </div>
  )
}
