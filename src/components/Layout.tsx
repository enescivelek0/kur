import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useT } from '../i18n'
import { fmtDate } from '../lib/format'
import { useLatest } from '../lib/queries'
import { useStore } from '../store'
import { Ticker } from './Ticker'

const DEV_URL = 'https://enescivelek.com'
const YEAR = new Date().getFullYear()

function useNav() {
  const n = useT().nav
  return [
    { to: '/', label: n.home },
    { to: '/kurlar', label: n.rates },
    { to: '/cevirici', label: n.converter },
    { to: '/grafikler', label: n.charts },
    { to: '/alarmlar', label: n.alerts },
    { to: '/hakkinda', label: n.about },
    { to: '/iletisim', label: n.contact },
  ]
}

export function Layout() {
  const t = useT().nav
  const nav = useNav()
  const { theme, toggleTheme, lang, setLang } = useStore()
  const [openAt, setOpenAt] = useState<string | null>(null)
  const { pathname } = useLocation()
  const open = openAt === pathname

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-[radial-gradient(60rem_30rem_at_50%_-10rem,rgba(16,185,129,.12),transparent)]">
      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-zinc-50/85 backdrop-blur dark:border-white/5 dark:bg-[#0b0f14]/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="size-8" />
            <span className="text-lg font-bold tracking-tight">Kur</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              className="btn-ghost h-9 px-2.5 text-xs font-semibold"
              aria-label={t.lang}
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <button className="btn-ghost size-9 px-0" aria-label={t.theme} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/cevirici"
              className="hidden h-9 items-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500 sm:inline-flex"
            >
              {t.cta}
            </Link>
            <button
              className="btn-ghost size-9 px-0 lg:hidden"
              aria-label={t.menu}
              onClick={() => setOpenAt(open ? null : pathname)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-zinc-200 px-4 py-2 lg:hidden dark:border-white/5">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                onClick={() => setOpenAt(null)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
        <Ticker />
      </header>

      <main key={pathname} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  const t = useT().footer
  const nav = useNav()
  const { data } = useLatest('EUR')
  return (
    <footer className="border-t border-zinc-200 bg-white/50 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="size-7" />
            <span className="font-bold">Kur</span>
          </div>
          <p className="text-sm text-zinc-500">{t.tagline}</p>
          {data && (
            <p className="text-xs text-zinc-500">
              {t.lastData}: {fmtDate(data.date)}
            </p>
          )}
        </div>
        <FooterCol title={t.tools} links={nav.slice(1, 5)} />
        <FooterCol title={t.company} links={[...nav.slice(5), { to: '/iletisim', label: t.support }]} />
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold">{t.developer}</h3>
          <a className="block text-zinc-500 hover:text-emerald-600" href={DEV_URL} target="_blank" rel="noreferrer">
            enescivelek.com
          </a>
          <a
            className="block text-zinc-500 hover:text-emerald-600"
            href="https://github.com/enescivelek0/kur"
            target="_blank"
            rel="noreferrer"
          >
            {t.source}
          </a>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-white/5">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-4 text-xs text-zinc-500">
          <span>
            © {YEAR} Kur. {t.rights}
          </span>
          <span>{t.disclaimer}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold">{title}</h3>
      {links.map((l) => (
        <Link key={l.label} to={l.to} className="block text-zinc-500 hover:text-emerald-600">
          {l.label}
        </Link>
      ))}
    </div>
  )
}
