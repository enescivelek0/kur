const names = new Intl.DisplayNames(['tr'], { type: 'currency' })

export const currencyName = (code: string) => {
  try {
    return names.of(code) ?? code
  } catch {
    return code
  }
}
