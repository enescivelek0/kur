import { useState, type FormEvent } from 'react'
import { useQueries } from '@tanstack/react-query'
import { api } from '../lib/api'
import { fmtRate } from '../lib/format'
import { useStore } from '../store'

/** Kur alarmları: hedef kur aşıldığında / altına inildiğinde tetiklenir (tarayıcıda saklanır). */
export function Alerts({ from, to }: { from: string; to: string }) {
  const { alerts, addAlert, removeAlert } = useStore()
  const [op, setOp] = useState<'above' | 'below'>('above')
  const [target, setTarget] = useState('')

  const bases = [...new Set(alerts.map((a) => a.from))]
  const results = useQueries({
    queries: bases.map((b) => ({
      queryKey: ['latest', b],
      queryFn: ({ signal }: { signal: AbortSignal }) => api.latest(b, signal),
      staleTime: 36e5,
    })),
  })
  const rateOf = (f: string, t: string) => results[bases.indexOf(f)]?.data?.rates[t]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(target.replace(',', '.'))
    if (!n || from === to) return
    addAlert({ from, to, op, target: n })
    setTarget('')
  }

  return (
    <section className="card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Kur Alarmları</h2>

      <form onSubmit={submit} className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">
          1 {from} / {to}
        </span>
        <select className="field h-9 w-auto" value={op} onChange={(e) => setOp(e.target.value as 'above' | 'below')}>
          <option value="above">üstüne çıkarsa</option>
          <option value="below">altına inerse</option>
        </select>
        <input
          className="field tabular h-9 w-28"
          inputMode="decimal"
          placeholder="Hedef"
          value={target}
          onChange={(e) => setTarget(e.target.value.replace(/[^\d.,]/g, ''))}
        />
        <button className="h-9 rounded-lg bg-emerald-600 px-4 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-40" disabled={!target || from === to}>
          Ekle
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {alerts.length === 0 && <li className="text-sm text-zinc-500">Henüz alarm yok.</li>}
        {alerts.map((a) => {
          const rate = rateOf(a.from, a.to)
          const hit = rate !== undefined && (a.op === 'above' ? rate >= a.target : rate <= a.target)
          return (
            <li
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                hit ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-200 dark:border-white/10'
              }`}
            >
              <span className={`size-2 rounded-full ${hit ? 'animate-pulse bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
              <span className="flex-1">
                <b>
                  {a.from}/{a.to}
                </b>{' '}
                {a.op === 'above' ? '≥' : '≤'} <span className="tabular">{fmtRate(a.target)}</span>
                <span className="tabular ml-2 text-xs text-zinc-500">şu an {rate ? fmtRate(rate) : '…'}</span>
              </span>
              {hit && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Tetiklendi</span>}
              <button aria-label="Alarmı sil" className="text-zinc-400 hover:text-rose-500" onClick={() => removeAlert(a.id)}>
                ✕
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
