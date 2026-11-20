import { Link } from 'react-router'
import { useT } from '../i18n'

export default function NotFound() {
  const t = useT().notFound
  return (
    <div className="grid place-items-center py-24 text-center">
      <p className="text-6xl font-bold text-emerald-500">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-500">{t.text}</p>
      <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-xl bg-emerald-600 px-5 font-medium text-white">
        {t.back}
      </Link>
    </div>
  )
}
