import { currencyName } from '../lib/currency'
import { useCurrencies } from '../lib/queries'


interface Props {
  value: string
  onChange: (code: string) => void
  label: string
  className?: string
}

export function CurrencySelect({ value, onChange, label, className = '' }: Props) {
  const { data } = useCurrencies()
  const codes = data ? Object.keys(data) : [value]
  return (
    <select
      aria-label={label}
      className={`field cursor-pointer font-medium ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {codes.map((c) => (
        <option key={c} value={c}>
          {c} · {currencyName(c)}
        </option>
      ))}
    </select>
  )
}
