import { ArrowRight, BellRing, ChartLine, Globe2, Share2, ShieldCheck, Zap } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router'
import { Converter } from '../components/Converter'
import { MarketCards } from '../components/MarketCards'
import { RatesBoard } from '../components/RatesBoard'
import { useT } from '../i18n'

const HistoryChart = lazy(() => import('../components/HistoryChart'))
const ICONS = [Zap, ChartLine, BellRing, Share2, ShieldCheck, Globe2]

export default function Home() {
  const t = useT().home
  const [conv, setConv] = useState({ amount: '1000', from: 'USD', to: 'TRY' })

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 pt-4 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {t.badge}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {t.title1}
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">{t.title2}</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-zinc-500">{t.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/kurlar"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 font-medium text-white transition hover:bg-emerald-500"
            >
              {t.ctaRates} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/grafikler"
              className="inline-flex h-11 items-center rounded-xl border border-zinc-200 px-5 font-medium transition hover:border-emerald-500 dark:border-white/10"
            >
              {t.ctaCharts}
            </Link>
          </div>
        </div>
        <Converter {...conv} onChange={(p) => setConv((s) => ({ ...s, ...p }))} shareable={false} />
      </section>

      <section>
        <SectionTitle title={t.market} link="/kurlar" linkLabel={t.allRates} />
        <MarketCards />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Suspense fallback={<div className="card h-96 animate-pulse" />}>
          <HistoryChart from="USD" to="TRY" />
        </Suspense>
        <RatesBoard limit={6} />
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4 dark:border-white/10 dark:bg-white/10">
        {t.stats.map(([value, label]) => (
          <div key={label} className="bg-white px-6 py-8 text-center dark:bg-[#0f141a]">
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <div className="mt-1 text-sm text-zinc-500">{label}</div>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle title={t.featuresTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map(([title, text], i) => {
            const Icon = ICONS[i]
            return (
              <div key={title} className="card">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-zinc-500">{text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.faqTitle}</h2>
          <p className="mt-3 text-zinc-500">
            {t.faqLead}{' '}
            <Link to="/iletisim" className="text-emerald-600 underline dark:text-emerald-400">
              {t.faqLink}
            </Link>
            .
          </p>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-white/10">
          {t.faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {q}
                <span className="text-zinc-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-zinc-500">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-emerald-600 px-6 py-12 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-emerald-50/90">{t.ctaText}</p>
        <Link
          to="/alarmlar"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          {t.ctaBtn} <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  )
}

function SectionTitle({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {link && (
        <Link to={link} className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
