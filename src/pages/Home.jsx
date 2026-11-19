import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import Countdown from '../components/Countdown.jsx'
import Stars from '../components/Stars.jsx'
import { LogoIcon } from '../components/Logo.jsx'
import SmartImg from '../components/SmartImg.jsx'

export default function Home() {
  const { t, lang, fmt, num, pname, categories, products } = useStore()
  const byTag = (tag) => products.filter((p) => p.tags?.includes(tag))
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const flash = byTag('flash').slice(0, 4)
  const trending = byTag('trending').slice(0, 4)
  const recommended = byTag('recommended').slice(0, 8)

  const collections = [
    { cat: 'electronics', title: t('techTitle'), sub: t('techSub'), emoji: '⌚🎧', from: '#3B82F6' },
    { cat: 'beauty', title: t('glowTitle'), sub: t('glowSub'), emoji: '🧴💄', from: '#EC4899' },
    { cat: 'home', title: t('homeTitle'), sub: t('homeSub'), emoji: '🛋️🪴', from: '#F59E0B' },
    { cat: 'fashion', title: t('streetTitle'), sub: t('streetSub'), emoji: '🧥👟', from: '#8B5CF6' },
  ]
  const floats = [
    { e: '👗', l: categories[0]?.name[lang], x: '6%', y: '14%' },
    { e: '🎧', l: categories[1]?.name[lang], x: '70%', y: '6%' },
    { e: '💄', l: categories[2]?.name[lang], x: '78%', y: '44%' },
    { e: '🛋️', l: categories[3]?.name[lang], x: '4%', y: '52%' },
    { e: '👟', l: categories[4]?.name[lang], x: '40%', y: '0%' },
  ]
  const testimonials = [
    { n: 'Jannatul F.', e: '🎧', text: { en: 'Amazing quality and super fast delivery. Anaqia is now my go-to shopping site!', bn: 'দারুণ মান আর খুব দ্রুত ডেলিভারি। Anaqia এখন আমার প্রিয় শপিং সাইট!' } },
    { n: 'Rafiq H.', e: '⌚', text: { en: 'Huge variety and bKash payment made it so easy. Love it!', bn: 'অনেক রকম পণ্য, আর বিকাশে পেমেন্ট খুবই সহজ। দারুণ লেগেছে!' } },
    { n: 'Nusrat J.', e: '🧴', text: { en: 'The deals are unbeatable and customer support is so helpful.', bn: 'অফারগুলো অসাধারণ আর কাস্টমার সাপোর্ট খুবই আন্তরিক।' } },
  ]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">✨ Everything You Love</span>
            <h1>
              {t('heroTitle1')}<br />{t('heroTitle2')}<br />
              <span className="grad-text">{t('heroTitle3')}</span>
            </h1>
            <p className="lead">{t('heroText')}</p>
            <div className="hero-cta">
              <Link to="/shop" className="btn">{t('shopNow')} →</Link>
              <Link to="/shop?deals=1" className="btn btn-ghost">{t('exploreDeals')}</Link>
            </div>
            <div className="trust">
              {[['🛡️', t('secure')], ['🚚', t('fast')], ['↩️', t('returns')], ['🎧', t('support')]].map(([i, l]) => (
                <div key={l}><span>{i}</span>{l}</div>
              ))}
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <SmartImg src="images/site/hero.jpg" className="stage-photo" />
            <div className="stage-glow" />
            <div className="stage-ring r1" /><div className="stage-ring r2" />
            <div className="stage-logo"><LogoIcon size={150} /></div>
            {floats.map((f, i) => (
              <div key={i} className="float-card" style={{ left: f.x, top: f.y, animationDelay: `${i * 0.6}s` }}>
                <span>{f.e}</span><small>{f.l}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container">
        <div className="cat-strip card">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?cat=${c.id}`} className="cat-item" style={{ '--hue': c.hue }}>
              <span className="cat-icon"><SmartImg src={c.image} fallback={c.emoji} /></span>
              <span>{c.name[lang]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="container section">
        <div className="flash card">
          <div className="flash-head">
            <div>
              <span className="pill-hot">🔥 {t('flash')}</span>
              <p className="muted">{t('flashText')}</p>
            </div>
            <div className="flash-timer"><span className="muted">{t('endsIn')}</span><Countdown /></div>
          </div>
          <div className="grid-4">{flash.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="container section">
        <div className="section-head"><h2>{t('collections')}</h2><Link to="/shop">{t('viewAll')} →</Link></div>
        <div className="grid-4">
          {collections.map((c) => (
            <Link key={c.cat} to={`/shop?cat=${c.cat}`} className="collection" style={{ '--hue': c.from }}>
              <div><h3>{c.title}</h3><p>{c.sub}</p></div>
              <SmartImg src={`images/site/collection-${c.cat}.jpg`} className="col-photo" fallback={<span className="col-emoji">{c.emoji}</span>} />
              <span className="col-arrow">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="container section">
        <div className="section-head"><h2>{t('recommended')}</h2><Link to="/shop">{t('viewAll')} →</Link></div>
        <div className="grid-4">{recommended.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      {/* TRENDING + SALE + OFFER */}
      <section className="container section trio">
        <div className="card trending">
          <div className="section-head"><h3>{t('trending')}</h3><Link to="/shop">{t('viewAll')}</Link></div>
          {trending.map((p, i) => (
            <Link to={`/product/${p.id}`} key={p.id} className="trend-row">
              <span className="trend-num">{num(i + 1)}</span>
              <ProductVisual product={p} size="sm" />
              <span className="trend-info"><span>{pname(p)}</span><Stars rating={p.rating} /></span>
              <b>{fmt(p.price)}</b>
            </Link>
          ))}
        </div>
        <div className="sale-banner">
          <SmartImg src="images/site/sale-banner.jpg" className="sale-photo" />
          <div className="sale-ring" />
          <h2>{t('saleTitle')}</h2>
          <p>{t('saleText')}</p>
          <Link to="/shop?cat=fashion" className="btn">{t('saleBtn')}</Link>
          <span className="sale-emoji">🛍️</span>
        </div>
        <div className="card offer">
          <span className="pill-hot">🎁 {t('offerText')}</span>
          <h2 className="grad-text">{t('offerTitle')}</h2>
          <div className="code-box"><small>{t('useCode')}</small><b>WELCOME20</b></div>
          <Link to="/shop" className="btn btn-sm">{t('shopNow')} →</Link>
        </div>
      </section>

      {/* PERKS */}
      <section className="container section">
        <div className="perks">
          {[['⭐', t('rewards'), t('rewardsText')], ['💵', t('cod'), t('codText')], ['🎁', t('giftCards'), t('giftText')], ['🤝', t('refer'), t('referText')]].map(([i, h, p]) => (
            <div key={h} className="perk"><span>{i}</span><div><b>{h}</b><small>{p}</small></div></div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container section">
        <div className="section-head"><h2>{t('reviews')}</h2></div>
        <div className="grid-3">
          {testimonials.map((r) => (
            <div key={r.n} className="card review">
              <span className="rev-avatar">{r.e}</span>
              <div><b>{r.n}</b><div className="star">★★★★★</div><p className="muted">{r.text[lang]}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container section">
        <div className="card newsletter">
          <div className="nl-copy"><span className="nl-icon">✉️</span><div><b>{t('newsletter')}</b><p className="muted">{t('newsText')}</p></div></div>
          {done ? <p className="success">✓ {t('subscribed')}</p> : (
            <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true) }} className="nl-form">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email')} />
              <button className="btn">{t('subscribe')}</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
