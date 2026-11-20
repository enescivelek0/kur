import { Link } from 'react-router'
import { currencyName } from '../lib/currency'
import { fmtPct, fmtRate } from '../lib/format'
import { useLatest, useRecent } from '../lib/queries'
import { Sparkline } from './Sparkline'

/** Öne çıkan paritelerin TRY karşılığı, günlük değişim ve 2 haftalık mini grafik. */
export function MarketCards({ codes = ['USD', 'EUR', 'GBP', 'CHF'] }: { codes?: string[] }) {
  const { data } = useLatest('TRY')
  const { data: recent } = useRecent('TRY', codes)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {codes.map((c) => {
        const r = data?.rates[c]
        const prev = recent?.prev[c]
        const price = r ? 1 / r : undefined
        const change = r && prev ? ((1 / r - 1 / prev) / (1 / prev)) * 100 : 0
        const up = change >= 0
        return (
          <Link
            key={c}
            to={`/grafikler?from=${c}&to=TRY`}
            className="card group transition hover:-translate-y-0.5 hover:border-emerald-500/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{c}/TRY</div>
                <div className="text-xs text-zinc-500">{currencyName(c)}</div>
              </div>
              <span
                className={`tabular rounded-md px-1.5 py-0.5 text-xs font-medium ${
                  up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {prev ? fmtPct(change) : '—'}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              <div className="tabular text-2xl font-bold">
                {price ? fmtRate(price) : <span className="inline-block h-7 w-20 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />}
              </div>
              <Sparkline data={(recent?.spark[c] ?? []).map((v) => 1 / v)} up={up} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
