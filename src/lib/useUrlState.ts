import { useSearchParams } from 'react-router'

type Conv = { amount: string; from: string; to: string }

/** Çevirici durumunu URL'de tutar: link paylaşılınca aynı hesap açılır. */
export function useUrlState(defaults: Conv) {
  const [params, setParams] = useSearchParams()
  const code = (v: string | null, d: string) => (v && /^[A-Z]{3}$/.test(v) ? v : d)
  const state: Conv = {
    amount: params.get('amount') ?? defaults.amount,
    from: code(params.get('from'), defaults.from),
    to: code(params.get('to'), defaults.to),
  }
  const update = (patch: Partial<Conv>) => setParams({ ...state, ...patch }, { replace: true })
  return [state, update] as const
}
