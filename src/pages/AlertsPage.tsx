import { Alerts } from '../components/Alerts'
import { CurrencySelect } from '../components/CurrencySelect'
import { PageHeader } from '../components/PageHeader'
import { useT } from '../i18n'
import { useUrlState } from '../lib/useUrlState'

export default function AlertsPage() {
  const all = useT()
  const t = all.alertsPage
  const [pair, setPair] = useUrlState({ amount: '1', from: 'USD', to: 'TRY' })
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="card grid gap-3 sm:grid-cols-2">
            <CurrencySelect label={all.charts.from} value={pair.from} onChange={(from) => setPair({ from })} />
            <CurrencySelect label={all.charts.to} value={pair.to} onChange={(to) => setPair({ to })} />
          </div>
          <Alerts from={pair.from} to={pair.to} />
        </div>
        <aside className="card h-fit">
          <h2 className="mb-3 text-sm font-semibold">{t.how}</h2>
          <ol className="space-y-3 text-sm text-zinc-500">
            {t.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  )
}
