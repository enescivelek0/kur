import { Converter } from '../components/Converter'
import { PageHeader } from '../components/PageHeader'
import { useT } from '../i18n'
import { currencyName } from '../lib/currency'
import { fmtMoney } from '../lib/format'
import { useLatest } from '../lib/queries'
import { useUrlState } from '../lib/useUrlState'
import { useStore } from '../store'

export default function ConverterPage() {
  const t = useT().convPage
  const [conv, setConv] = useUrlState({ amount: '100', from: 'USD', to: 'TRY' })
  const { favorites } = useStore()
  const { data } = useLatest(conv.from)
  const value = Number(conv.amount.replace(',', '.')) || 0
  const targets = [...new Set(['TRY', ...favorites])].filter((c) => c !== conv.from)

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Converter {...conv} onChange={setConv} />
        <section className="card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {conv.amount || 0} {conv.from} {t.equivalents}
          </h2>
          <ul className="divide-y divide-zinc-100 dark:divide-white/5">
            {targets.map((c) => (
              <li key={c}>
                <button onClick={() => setConv({ to: c })} className="flex w-full items-center justify-between py-2.5 text-left text-sm">
                  <span>
                    <b className="font-semibold">{c}</b>
                    <span className="ml-2 text-xs text-zinc-500">{currencyName(c)}</span>
                  </span>
                  <span className="tabular font-medium">{data?.rates[c] ? fmtMoney(value * data.rates[c], c) : '…'}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
