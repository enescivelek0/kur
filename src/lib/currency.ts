import { useStore } from '../store'

const cache: Record<string, Intl.DisplayNames> = {}

export const currencyName = (code: string) => {
  const lang = useStore.getState().lang
  try {
    return (cache[lang] ??= new Intl.DisplayNames([lang], { type: 'currency' })).of(code) ?? code
  } catch {
    return code
  }
}
