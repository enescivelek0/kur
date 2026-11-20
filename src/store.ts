import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

export interface Alert {
  id: string
  from: string
  to: string
  op: 'above' | 'below'
  target: number
}

interface State {
  theme: Theme
  base: string
  favorites: string[]
  alerts: Alert[]
  toggleTheme: () => void
  setBase: (c: string) => void
  toggleFavorite: (c: string) => void
  addAlert: (a: Omit<Alert, 'id'>) => void
  removeAlert: (id: string) => void
}

const applyTheme = (t: Theme) => {
  document.documentElement.dataset.theme = t
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      theme: (document.documentElement.dataset.theme as Theme) || 'light',
      base: 'TRY',
      favorites: ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CNY'],
      alerts: [],
      toggleTheme: () =>
        set((s) => {
          const theme: Theme = s.theme === 'dark' ? 'light' : 'dark'
          applyTheme(theme)
          return { theme }
        }),
      setBase: (base) => set({ base }),
      toggleFavorite: (c) =>
        set((s) => ({
          favorites: s.favorites.includes(c) ? s.favorites.filter((f) => f !== c) : [...s.favorites, c],
        })),
      addAlert: (a) => set((s) => ({ alerts: [...s.alerts, { ...a, id: crypto.randomUUID() }] })),
      removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
    }),
    {
      name: 'kur-store',
      partialize: ({ theme, base, favorites, alerts }) => ({ theme, base, favorites, alerts }),
    },
  ),
)
