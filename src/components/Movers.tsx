import { TrendingDown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { fmtPct } from '../lib/format'
import { useT } from '../i18n'
import { useCurrencies, useLatest, useRecent } from '../lib/queries'

/** TRY karşısında son iş gününde en çok yükselen / düşen para birimleri. */
export function Movers() {
  const t = useT().movers
  const { data: currencies } = useCurrencies()
  const codes = currencies ? Object.keys(currencies).filter((c) => c !== 'TRY') : []
  const { data: latest } = useLatest('TRY')
  const { data: recent } = useRecent('TRY', codes)

  const changes = codes
    .filter((c) => latest?.rates[c] && recent?.prev[c])
    .map((c) => ({ c, pct: ((recent!.prev[c] - latest!.rates[c]) / latest!.rates[c]) * 100 }))
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className="space-y-4">
      <List title={t.up} icon={<TrendingUp className="size-4 text-emerald-500" />} items={changes.slice(0, 5)} />
      <List title={t.down} icon={<TrendingDown className="size-4 text-rose-500" />} items={changes.slice(-5).reverse()} />
    </div>
  )
}

function List({ title, icon, items }: { title: string; icon: ReactNode; items: { c: string; pct: number }[] }) {
  return (
    <section className="card">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h2>
      <ul className="space-y-1">
        {items.length === 0 &&
          Array.from({ length: 5 }, (_, i) => <li key={i} className="h-8 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />)}
        {items.map(({ c, pct }) => (
          <li key={c}>
            <Link
              to={`/grafikler?from=${c}&to=TRY`}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              <span className="font-medium">{c}/TRY</span>
              <span className={`tabular ${pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {fmtPct(pct)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
