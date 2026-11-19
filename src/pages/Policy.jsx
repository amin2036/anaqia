import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { policies } from '../data/policies.js'
import NotFound from './NotFound.jsx'

const PAGES = [['help', '/help'], ['returns', '/returns'], ['privacy', '/privacy'], ['terms', '/terms']]

export default function Policy({ page }) {
  const { lang, settings, t } = useStore()
  const doc = policies[page]
  if (!doc) return <NotFound />
  const fill = (s) => s
    .replaceAll('{phone}', settings.store_phone || '—')
    .replaceAll('{email}', settings.store_email || '—')
    .replaceAll('{inside}', settings.delivery_inside)
    .replaceAll('{outside}', settings.delivery_outside)
    .replaceAll('{free}', settings.free_over)
  return (
    <div className="container page policy">
      <nav className="policy-tabs">
        {PAGES.map(([k, to]) => (
          <Link key={k} to={to} className={k === page ? 'on' : ''}>{policies[k].title[lang]}</Link>
        ))}
        <Link to="/contact">{t('contact')}</Link>
      </nav>
      <div className="card policy-card">
        <h1>{doc.title[lang]}</h1>
        <p className="lead-sm">{fill(doc.intro[lang])}</p>
        {doc.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.h[lang]}</h2>
            {s.p && <p>{fill(s.p[lang])}</p>}
            {s.list && <ul>{s.list[lang].map((x, j) => <li key={j}>{fill(x)}</li>)}</ul>}
          </section>
        ))}
      </div>
    </div>
  )
}
