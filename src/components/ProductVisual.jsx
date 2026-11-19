import { categoryOf } from '../data/products.js'
import SmartImg from './SmartImg.jsx'

// Shows the product photo when the file exists, otherwise a soft pastel icon card.
export default function ProductVisual({ product, size = 'md' }) {
  const hue = categoryOf(product.cat)?.hue || '#8B5CF6'
  const icon = (
    <>
      <span className="pv-glow" />
      <span className="pv-ring" />
      <span className="pv-emoji" aria-hidden="true">{product.emoji}</span>
    </>
  )
  return (
    <div className={`pv pv-${size}`} style={{ '--hue': hue }}>
      <SmartImg src={product.image} alt={product.name.en} className="pv-img" fallback={icon} />
    </div>
  )
}
