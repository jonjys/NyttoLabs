'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { FTAX_LINE, OPERATOR_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

const accent = ACCENT.contact

const COPY = {
  en: {
    eyebrow: 'Contact',
    title: 'Get in touch.',
    lead: `General questions and partnerships. ${OPERATOR_LINE} ${FTAX_LINE}`,
    email: 'Email',
    inbox: 'General & partnerships',
    partnerForm: 'Open the partner inquiry form',
    name: 'Name*',
    emailField: 'Email*',
    message: 'Message*',
    consent: 'I consent to Nytto Labs storing this message to reply.',
    send: 'Send message',
    sending: 'Sending…',
    ok: 'Message received.',
    unavailable: `Messages can't be stored right now. Email ${PUBLIC_HELLO_EMAIL} instead.`,
    invalid: 'Please complete the required fields and consent.',
    failed: 'Something went wrong. Please try again.',
    network: 'Network error. Please try again.',
  },
  sv: {
    eyebrow: 'Kontakt',
    title: 'Hör av dig.',
    lead: 'Allmänna frågor och partnerskap. Nytto Labs drivs av Fredrik Kornelind (Sverige). Godkänd för F‑skatt.',
    email: 'E-post',
    inbox: 'Allmänt och partnerskap',
    partnerForm: 'Öppna formuläret för partnerförfrågningar',
    name: 'Namn*',
    emailField: 'E-post*',
    message: 'Meddelande*',
    consent: 'Jag samtycker till att Nytto Labs sparar meddelandet för att kunna svara.',
    send: 'Skicka meddelande',
    sending: 'Skickar…',
    ok: 'Meddelandet har tagits emot.',
    unavailable: `Meddelanden kan inte sparas just nu. Mejla ${PUBLIC_HELLO_EMAIL} i stället.`,
    invalid: 'Fyll i de obligatoriska fälten och ge ditt samtycke.',
    failed: 'Något gick fel. Försök igen.',
    network: 'Nätverksfel. Försök igen.',
  },
}

export default function ContactView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  // hello@ is the only public contact address.
  const inboxes = [{ label: t.inbox, email: PUBLIC_HELLO_EMAIL }]
  const [form, setForm] = useState({ name: '', email: '', reason: 'general', message: '', consent: false })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact-inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ ok: true, msg: t.ok })
        setForm({ name: '', email: '', reason: 'general', message: '', consent: false })
      } else if (res.status === 503) {
        setStatus({ ok: false, msg: t.unavailable })
      } else {
        setStatus({ ok: false, msg: data.error === 'validation' ? t.invalid : t.failed })
      }
    } catch {
      setStatus({ ok: false, msg: t.network })
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'mt-1.5 min-h-11 w-full rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/20'
  const fieldStyle = { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }
  const labelCls = 'block text-xs font-medium'
  const labelStyle = { color: 'rgba(255,255,255,0.55)' }

  const onFocus = (e) => {
    e.target.style.borderColor = `${accent}80`
    e.target.style.background = 'rgba(255,255,255,0.05)'
  }
  const onBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.background = 'rgba(255,255,255,0.03)'
  }

  const text = (key, extra = {}) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: field,
    style: fieldStyle,
    onFocus,
    onBlur,
    ...extra,
  })

  return (
    <PageShell
      accent={accent}
      wide
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
    >
      <section className="mx-auto max-w-6xl px-5 py-10 2xl:max-w-[1560px]">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em]" style={{ color: accent }}>
              {t.email}
            </p>
            <ul className="mt-5 divide-y" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {inboxes.map((item) => (
                <li key={item.email} className="flex flex-col gap-0.5 py-4 first:pt-0">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex min-h-9 w-fit items-center break-all text-[15px] font-medium transition-opacity duration-200 hover:opacity-80"
                    style={{ color: accent }}
                  >
                    {item.email}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/partners"
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {t.partnerForm} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl p-6 backdrop-blur-sm lg:col-span-3"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls} style={labelStyle}>
                {t.name}
                <input required {...text('name')} />
              </label>
              <label className={labelCls} style={labelStyle}>
                {t.emailField}
                <input required type="email" {...text('email')} />
              </label>
            </div>

            <label className={`mt-4 ${labelCls}`} style={labelStyle}>
              {t.message}
              <textarea required rows={5} {...text('message')} />
            </label>

            <label
              className="mt-5 flex items-start gap-2.5 text-sm"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ accentColor: accent }}
              />
              <span>{t.consent}</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: accent, color: '#03030c' }}
            >
              {submitting ? t.sending : t.send}
            </button>

            {status && (
              <div
                role="status"
                className="mt-5 flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm"
                style={{
                  border: `1px solid ${status.ok ? '#00ff9d4d' : '#ff4d6d4d'}`,
                  background: status.ok ? '#00ff9d12' : '#ff4d6d12',
                  color: status.ok ? '#00ff9d' : '#ff8095',
                }}
              >
                {status.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{status.msg}</span>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  )
}
