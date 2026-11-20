import { CheckCircle2, Clock, Mail, MapPin } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useT } from '../i18n'

const ICONS = [Mail, MapPin, Clock]

export default function Contact() {
  const t = useT().contact
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Demo form: gerçek bir sunucuya gönderilmez.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      form.reset()
    }, 800)
  }

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="card space-y-4">
          {sent && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" /> {t.sent}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.name} name="name" />
            <Field label={t.email} name="email" type="email" />
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t.topic}</span>
            <select name="topic" className="field">
              {t.topics.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t.message}</span>
            <textarea name="message" required rows={5} className="field h-auto resize-y py-2.5" placeholder={t.placeholder} />
          </label>
          <button
            disabled={loading}
            className="h-11 rounded-xl bg-emerald-600 px-6 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? t.sending : t.send}
          </button>
        </form>

        <aside className="space-y-3">
          {t.info.map(([label, value], i) => {
            const Icon = ICONS[i]
            return (
              <div key={label} className="card flex items-center gap-4">
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            )
          })}
          <a
            href="https://enescivelek.com"
            target="_blank"
            rel="noreferrer"
            className="card block text-sm text-zinc-500 transition hover:border-emerald-500/40"
          >
            {t.dev} <span className="font-medium text-emerald-600 dark:text-emerald-400">enescivelek.com</span>
          </a>
        </aside>
      </div>
    </>
  )
}

function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input name={name} type={type} required className="field" />
    </label>
  )
}
