import { locale } from '../i18n'

export function fmtRate(n: number) {
  const digits = n >= 100 ? 2 : n >= 1 ? 4 : 6
  return n.toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: digits })
}

export function fmtMoney(n: number, code: string) {
  try {
    return n.toLocaleString(locale(), {
      style: 'currency',
      currency: code,
      maximumFractionDigits: Math.abs(n) < 1 && n !== 0 ? 6 : 2,
    })
  } catch {
    return `${fmtRate(n)} ${code}`
  }
}

export function fmtPct(n: number) {
  const s = n.toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${n > 0 ? '+' : ''}${s}%`
}

export function fmtDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(locale(), opts)
}
