const BASE = 'https://api.frankfurter.dev/v1'

export type Currencies = Record<string, string>
export interface Latest {
  base: string
  date: string
  rates: Record<string, number>
}
export interface Series {
  base: string
  start_date: string
  end_date: string
  rates: Record<string, Record<string, number>>
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(BASE + path, { signal })
  if (!res.ok) throw new Error(`API hatası (${res.status})`)
  return res.json() as Promise<T>
}

export const api = {
  currencies: (s?: AbortSignal) => get<Currencies>('/currencies', s),
  latest: (base: string, s?: AbortSignal) => get<Latest>(`/latest?base=${base}`, s),
  series: (base: string, start: string, symbols: string[], s?: AbortSignal) =>
    get<Series>(`/${start}..?base=${base}&symbols=${symbols.join(',')}`, s),
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10)
export const daysAgo = (n: number) => isoDate(new Date(Date.now() - n * 864e5))
