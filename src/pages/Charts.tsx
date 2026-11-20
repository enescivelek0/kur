import { ArrowLeftRight } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { CurrencySelect } from '../components/CurrencySelect'
import { MarketCards } from '../components/MarketCards'
import { PageHeader } from '../components/PageHeader'
import { useT } from '../i18n'
import { useUrlState } from '../lib/useUrlState'

const HistoryChart = lazy(() => import('../components/HistoryChart'))

export default function Charts() {
  const t = useT().charts
  const [pair, setPair] = useUrlState({ amount: '1', from: 'USD', to: 'TRY' })

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc}>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <CurrencySelect label={t.from} value={pair.from} onChange={(from) => setPair({ from })} className="sm:w-44" />
          <button aria-label="Swap" className="btn-ghost size-11 shrink-0 px-0" onClick={() => setPair({ from: pair.to, to: pair.from })}>
            <ArrowLeftRight className="size-4" />
          </button>
          <CurrencySelect label={t.to} value={pair.to} onChange={(to) => setPair({ to })} className="sm:w-44" />
        </div>
      </PageHeader>
      <div className="space-y-6">
        <Suspense fallback={<div className="card h-[28rem] animate-pulse" />}>
          <HistoryChart from={pair.from} to={pair.to} />
        </Suspense>
        <div>
          <h2 className="mb-4 text-lg font-semibold">{t.others}</h2>
          <MarketCards codes={['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'CNY']} />
        </div>
      </div>
    </>
  )
}
