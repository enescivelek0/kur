import { useEffect, useState } from 'react'

/** Çevirici durumunu URL'de tutar: link paylaşılınca aynı hesap açılır. */
export function useUrlState(defaults: { amount: string; from: string; to: string }) {
  const [state, setState] = useState(() => {
    const p = new URLSearchParams(location.search)
    const code = (v: string | null, d: string) => (v && /^[A-Z]{3}$/.test(v) ? v : d)
    return {
      amount: p.get('amount') ?? defaults.amount,
      from: code(p.get('from'), defaults.from),
      to: code(p.get('to'), defaults.to),
    }
  })

  useEffect(() => {
    const p = new URLSearchParams(state)
    history.replaceState(null, '', `?${p}`)
  }, [state])

  const update = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }))
  return [state, update] as const
}
