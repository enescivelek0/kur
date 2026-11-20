import { ArrowUpRight } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useT } from '../i18n'

export default function About() {
  const t = useT().about
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />

      <div className="grid gap-4 sm:grid-cols-3">
        {t.values.map(([title, d]) => (
          <div key={title} className="card">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t.roadmap}</h2>
          <ol className="relative space-y-6 border-l border-zinc-200 pl-6 dark:border-white/10">
            {t.timeline.map(([date, title, text]) => (
              <li key={title} className="relative">
                <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-emerald-500 ring-4 ring-zinc-50 dark:ring-[#0b0f14]" />
                <p className="text-xs text-zinc-500">{date}</p>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-zinc-500">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">{t.sourceTitle}</h2>
          <p className="text-zinc-500">
            {t.source1}{' '}
            <a className="text-emerald-600 underline dark:text-emerald-400" href="https://frankfurter.dev" target="_blank" rel="noreferrer">
              Frankfurter
            </a>{' '}
            {t.source2}
          </p>
          <a
            href="https://enescivelek.com"
            target="_blank"
            rel="noreferrer"
            className="card mt-6 flex items-center justify-between transition hover:border-emerald-500/40"
          >
            <div>
              <p className="text-xs text-zinc-500">{t.developer}</p>
              <p className="font-semibold">Enes Civelek</p>
              <p className="text-sm text-zinc-500">enescivelek.com</p>
            </div>
            <ArrowUpRight className="size-5 text-emerald-500" />
          </a>
        </section>
      </div>
    </>
  )
}
