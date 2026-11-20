import { useMemo, useState } from 'react'
import { fmtPct, fmtRate } from '../lib/format'
import { useCurrencies, useLatest, useRecent } from '../lib/queries'
import { useStore } from '../store'
import { currencyName } from '../lib/currency'
import { CurrencySelect } from './CurrencySelect'
import { Sparkline } from './Sparkline'

/**
 * Kur tablosu: "1 USD kaç TRY?" şeklinde gösterir (ana para birimi karşılığı).
 * API base=ana birim verdiği için oranı ters çeviriyoruz.
 */
export function RatesBoard({ onPick }: { onPick: (code: string) => void }) {
  const { base, setBase, favorites, toggleFavorite } = useStore()
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const { data: currencies } = useCurrencies()
  const { data: latest, isLoading } = useLatest(base)

  const codes = useMemo(() => {
    const all = currencies ? Object.keys(currencies).filter((c) => c !== base) : []
    const q = query.trim().toLocaleLowerCase('tr')
    const list = q
      ? all.filter((c) => c.toLowerCase().includes(q) || currencyName(c).toLocaleLowerCase('tr').includes(q))
      : showAll
        ? all
        : favorites.filter((f) => f !== base)
    return [...list].sort((a, b) => Number(favorites.includes(b)) - Number(favorites.includes(a)))
  }, [currencies, base, query, showAll, favorites])

  const { data: recent } = useRecent(base, codes)

  return (
    <section className="card">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-sm font-semibold uppercase tracking-wider text-zinc-500">Kur Tablosu</h2>
        <CurrencySelect label="Ana para birimi" value={base} onChange={setBase} className="h-9 w-auto" />
      </div>

      <div className="mb-3 flex gap-2">
        <input
          className="field h-9"
          placeholder="Para birimi ara (ör. dolar, JPY)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-ghost shrink-0" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Favoriler' : 'Tümü'}
        </button>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-white/5">
        {isLoading &&
          Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="h-14 animate-pulse py-2">
              <div className="h-full rounded-lg bg-zinc-100 dark:bg-white/5" />
            </li>
          ))}
        {latest &&
          codes.map((c) => {
            const r = latest.rates[c]
            if (!r) return null
            const price = 1 / r
            const prev = recent?.prev[c]
            const change = prev ? ((1 / r - 1 / prev) / (1 / prev)) * 100 : 0
            const up = change >= 0
            const fav = favorites.includes(c)
            return (
              <li key={c} className="flex items-center gap-3 py-2.5">
                <button
                  aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  className={`text-lg transition ${fav ? 'text-amber-400' : 'text-zinc-300 hover:text-amber-400 dark:text-zinc-600'}`}
                  onClick={() => toggleFavorite(c)}
                >
                  ★
                </button>
                <button className="min-w-0 flex-1 text-left" onClick={() => onPick(c)}>
                  <div className="font-semibold">{c}</div>
                  <div className="truncate text-xs text-zinc-500">{currencyName(c)}</div>
                </button>
                <div className="hidden sm:block">
                  <Sparkline data={(recent?.spark[c] ?? []).map((v) => 1 / v)} up={up} />
                </div>
                <div className="text-right">
                  <div className="tabular font-semibold">{fmtRate(price)}</div>
                  <div className={`tabular text-xs ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {prev ? fmtPct(change) : '—'}
                  </div>
                </div>
              </li>
            )
          })}
        {latest && codes.length === 0 && (
          <li className="py-6 text-center text-sm text-zinc-500">Sonuç yok. Yıldızla favori ekleyebilirsin.</li>
        )}
      </ul>
      <p className="mt-3 text-xs text-zinc-500">
        Değerler 1 birimin {base} karşılığıdır. Satıra tıklayınca çevirici ve grafik o para birimine geçer.
      </p>
    </section>
  )
}
