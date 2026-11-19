import { useStore } from '../context/StoreContext.jsx'
import SmartImg from './SmartImg.jsx'

// Shows the product photo (first image) when available, otherwise a soft pastel icon card.
export default function ProductVisual({ product, size = 'md', image }) {
  const { categoryOf } = useStore()
  const hue = categoryOf(product.cat)?.hue || '#8B5CF6'
  const src = image || product.images?.[0]
  const icon = (
    <>
      <span className="pv-glow" />
      <span className="pv-ring" />
      <span className="pv-emoji" aria-hidden="true">{product.emoji}</span>
    </>
  )
  return (
    <div className={`pv pv-${size}`} style={{ '--hue': hue }}>
      <SmartImg key={src} src={src} alt={product.name.en} className="pv-img" fallback={icon} />
    </div>
  )
}
