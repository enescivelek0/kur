import { ArrowLeftRight, Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import { fmtDate, fmtMoney, fmtRate } from '../lib/format'
import { locale, useT } from '../i18n'
import { useLatest } from '../lib/queries'
import { CurrencySelect } from './CurrencySelect'

interface Props {
  amount: string
  from: string
  to: string
  onChange: (patch: Partial<{ amount: string; from: string; to: string }>) => void
  shareable?: boolean
}

const QUICK = [100, 1000, 5000, 10000]

export function Converter({ amount, from, to, onChange, shareable = true }: Props) {
  const t = useT().converter
  const { data, isLoading, isError } = useLatest(from)
  const [copied, setCopied] = useState(false)

  const value = Number(amount.replace(',', '.'))
  const rate = from === to ? 1 : data?.rates[to]
  const result = rate && Number.isFinite(value) ? value * rate : undefined

  const share = async () => {
    await navigator.clipboard.writeText(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.title}</h2>
        {shareable && <button className="btn-ghost" onClick={share}>
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {copied ? t.copied : t.share}
        </button>}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="space-y-2">
          <label className="text-xs text-zinc-500" htmlFor="amount">
            {t.amount}
          </label>
          <input
            id="amount"
            className="field tabular h-14 text-2xl font-semibold"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onChange({ amount: e.target.value.replace(/[^\d.,]/g, '') })}
          />
          <CurrencySelect label={t.from} value={from} onChange={(c) => onChange({ from: c })} />
        </div>

        <button
          aria-label={t.swap}
          className="mx-auto grid size-11 place-items-center rounded-full border border-zinc-200 bg-white transition hover:rotate-180 hover:border-emerald-500 dark:border-white/10 dark:bg-zinc-900"
          onClick={() => onChange({ from: to, to: from })}
        >
          <ArrowLeftRight className="size-4" />
        </button>

        <div className="space-y-2">
          <span className="text-xs text-zinc-500">{t.result}</span>
          <output
            aria-live="polite"
            className="tabular flex h-14 items-center overflow-hidden rounded-xl bg-emerald-500/10 px-3 text-2xl font-semibold text-emerald-700 dark:text-emerald-400"
          >
            {isLoading ? <span className="h-6 w-32 animate-pulse rounded bg-emerald-500/20" /> : result !== undefined ? fmtMoney(result, to) : '—'}
          </output>
          <CurrencySelect label={t.to} value={to} onChange={(c) => onChange({ to: c })} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10"
            onClick={() => onChange({ amount: String(q) })}
          >
            {q.toLocaleString(locale())}
          </button>
        ))}
        <span className="tabular ml-auto text-xs text-zinc-500">
          {isError
            ? t.error
            : rate && data
              ? `1 ${from} = ${fmtRate(rate)} ${to} · 1 ${to} = ${fmtRate(1 / rate)} ${from} · ${fmtDate(data.date)}`
              : ''}
        </span>
      </div>
    </section>
  )
}
