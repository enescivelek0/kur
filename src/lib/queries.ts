import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, daysAgo } from './api'

const HOUR = 36e5

export const useCurrencies = () =>
  useQuery({
    queryKey: ['currencies'],
    queryFn: ({ signal }) => api.currencies(signal),
    staleTime: 24 * HOUR,
  })

export const useLatest = (base: string) =>
  useQuery({
    queryKey: ['latest', base],
    queryFn: ({ signal }) => api.latest(base, signal),
    staleTime: HOUR,
  })

/** Son ~2 haftanın verisi: günlük değişim yüzdesi ve mini grafik (sparkline) için. */
export const useRecent = (base: string, symbols: string[]) =>
  useQuery({
    queryKey: ['recent', base, [...symbols].sort().join()],
    enabled: symbols.length > 0,
    staleTime: HOUR,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const s = await api.series(base, daysAgo(14), symbols, signal)
      const dates = Object.keys(s.rates).sort()
      const spark: Record<string, number[]> = {}
      for (const d of dates) {
        for (const [c, v] of Object.entries(s.rates[d])) (spark[c] ??= []).push(v)
      }
      return { prev: s.rates[dates.at(-2) ?? ''] ?? {}, spark }
    },
  })

export const useHistory = (from: string, to: string, days: number) =>
  useQuery({
    queryKey: ['history', from, to, days],
    enabled: from !== to,
    staleTime: HOUR,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const s = await api.series(from, daysAgo(days), [to], signal)
      return Object.entries(s.rates)
        .map(([date, r]) => ({ date, value: r[to] }))
        .sort((a, b) => a.date.localeCompare(b.date))
    },
  })
