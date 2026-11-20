import { fmtPct, fmtRate } from '../lib/format'
import { useLatest, useRecent } from '../lib/queries'

const PAIRS = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'CNY', 'SEK', 'NOK']

/** Header altında kayan kur bandı (TRY karşılıkları). */
export function Ticker() {
  const { data } = useLatest('TRY')
  const { data: recent } = useRecent('TRY', PAIRS)
  if (!data) return <div className="h-9 border-t border-zinc-200/70 dark:border-white/5" />

  const items = PAIRS.filter((c) => data.rates[c]).map((c) => {
    const price = 1 / data.rates[c]
    const prev = recent?.prev[c] ? 1 / recent.prev[c] : undefined
    return { c, price, change: prev ? ((price - prev) / prev) * 100 : 0 }
  })

  return (
    <div className="group relative h-9 overflow-hidden border-t border-zinc-200/70 dark:border-white/5">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((i, k) => (
          <span key={k} className="tabular flex h-9 items-center gap-2 px-5 text-xs">
            <b className="font-semibold">{i.c}/TRY</b>
            <span>{fmtRate(i.price)}</span>
            <span className={i.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {fmtPct(i.change)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
