import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, desc, children }: { eyebrow: string; title: string; desc: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-zinc-500">{desc}</p>
      </div>
      {children}
    </div>
  )
}
