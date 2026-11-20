import { lazy, Suspense } from 'react'
import { Alerts } from './components/Alerts'
import { Converter } from './components/Converter'
import { RatesBoard } from './components/RatesBoard'
import { fmtDate } from './lib/format'
import { useLatest } from './lib/queries'
import { useUrlState } from './lib/useUrlState'
import { useStore } from './store'

const HistoryChart = lazy(() => import('./components/HistoryChart'))

export default function App() {
  const { theme, toggleTheme, base } = useStore()
  const [conv, setConv] = useUrlState({ amount: '100', from: 'USD', to: 'TRY' })
  const { data } = useLatest(base)

  return (
    <div className="min-h-dvh bg-[radial-gradient(60rem_30rem_at_50%_-10rem,rgba(16,185,129,.12),transparent)]">
      <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-white/5 dark:bg-[#0b0f14]/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <img src="/favicon.svg" alt="" className="size-7" />
          <span className="text-lg font-bold tracking-tight">Kur</span>
          {data && (
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-700 sm:inline-flex dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {fmtDate(data.date)} verisi
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            <a className="btn-ghost" href="https://github.com/enescivelek0/kur" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <button className="btn-ghost" aria-label="Temayı değiştir" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-4">
          <Converter {...conv} onChange={setConv} />
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <HistoryChart from={conv.from} to={conv.to} />
          </Suspense>
          <Alerts from={conv.from} to={conv.to} />
        </div>
        <aside className="min-w-0">
          <RatesBoard onPick={(c) => setConv({ from: c, to: base === c ? conv.to : base })} />
        </aside>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-zinc-500">
        Veriler{' '}
        <a className="underline" href="https://frankfurter.dev" target="_blank" rel="noreferrer">
          Frankfurter
        </a>{' '}
        üzerinden Avrupa Merkez Bankası referans kurlarıdır; iş günlerinde ~16:00 CET güncellenir. Yatırım tavsiyesi değildir.
        · Geliştiren{' '}
        <a className="underline" href="https://enescivelek.com" target="_blank" rel="noreferrer">
          Enes Civelek
        </a>
      </footer>
    </div>
  )
}
