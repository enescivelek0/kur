import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtDate, fmtPct, fmtRate } from '../lib/format'
import { useHistory } from '../lib/queries'
import { useT } from '../i18n'

const RANGES = [7, 30, 90, 365, 1825, 3650]

export default function HistoryChart({ from, to }: { from: string; to: string }) {
  const t = useT().chart
  const [days, setDays] = useState<number>(90)
  const { data = [], isLoading, isFetching, isError } = useHistory(from, to, days)

  const stats = useMemo(() => {
    if (data.length < 2) return null
    const values = data.map((d) => d.value)
    const first = values[0]
    const last = values.at(-1)!
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      change: ((last - first) / first) * 100,
    }
  }, [data])

  const up = (stats?.change ?? 0) >= 0
  const color = up ? '#10b981' : '#f43f5e'

  return (
    <section className="card">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {from}/{to} {t.history}
        </h2>
        <div role="tablist" className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-white/5">
          {RANGES.map((d, i) => (
            <RangeBtn key={d} label={t.ranges[i]} active={days === d} onClick={() => setDays(d)} />
          ))}
        </div>
      </div>

      {stats && (
        <dl className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [t.change, fmtPct(stats.change), up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'],
            [t.min, fmtRate(stats.min), ''],
            [t.max, fmtRate(stats.max), ''],
            [t.avg, fmtRate(stats.avg), ''],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-white/[0.03]">
              <dt className="text-xs text-zinc-500">{k}</dt>
              <dd className={`tabular font-semibold ${cls}`}>{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={`h-64 transition-opacity sm:h-80 ${isFetching ? 'opacity-60' : ''}`}>
        {from === to ? (
          <Empty text={t.same} />
        ) : isError ? (
          <Empty text={t.error} />
        ) : isLoading ? (
          <div className="h-full animate-pulse rounded-xl bg-zinc-100 dark:bg-white/5" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={40}
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }}
                tickFormatter={(d: string) =>
                  fmtDate(d, days > 365 ? { month: 'short', year: '2-digit' } : { day: 'numeric', month: 'short' })
                }
              />
              <YAxis
                domain={['auto', 'auto']}
                width={56}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }}
                tickFormatter={(v: number) => fmtRate(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(127,127,127,.2)',
                  background: 'var(--tooltip-bg, #fff)',
                  fontSize: 12,
                }}
                labelFormatter={(d) => fmtDate(String(d))}
                formatter={(v) => [`${fmtRate(Number(v))} ${to}`, `1 ${from}`]}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#fill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}

const Empty = ({ text }: { text: string }) => (
  <div className="grid h-full place-items-center rounded-xl border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-white/10">
    {text}
  </div>
)

function RangeBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
