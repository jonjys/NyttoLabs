'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import PageShell, { StatusNote } from '@/components/site/page-shell'
import { FTAX_LINE, OPERATOR_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

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

  const text = (key, extra = {}) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: 'nl-field',
    ...extra,
  })
  const labelCls = 'block text-[13px] font-medium text-ink-2'

  return (
    <PageShell
      wide
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
    >
      <section className="mx-auto max-w-6xl px-5 pt-4">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="nl-label">{t.email}</p>
            <ul className="mt-5 space-y-4">
              {inboxes.map((item) => (
                <li key={item.email} className="nl-card p-6">
                  <span className="text-sm text-faded">{item.label}</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="mt-1 block break-all font-serif text-[30px] italic leading-tight text-ink transition-colors hover:text-iris"
                  >
                    {item.email}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/partners" className="nl-link mt-6 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink">
              {t.partnerForm} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <form onSubmit={submit} className="nl-card p-6 sm:p-8 lg:col-span-3">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelCls}>
                {t.name}
                <input required {...text('name')} />
              </label>
              <label className={labelCls}>
                {t.emailField}
                <input required type="email" {...text('email')} />
              </label>
            </div>

            <label className={`mt-5 ${labelCls}`}>
              {t.message}
              <textarea required rows={6} {...text('message')} />
            </label>

            <label className="mt-5 flex items-start gap-3 text-[15px] text-ink-2">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0c0c0e]"
              />
              <span>{t.consent}</span>
            </label>

            <button type="submit" disabled={submitting} className="nl-btn mt-7">
              {submitting ? t.sending : t.send}
            </button>

            <StatusNote status={status} />
          </form>
        </div>
      </section>
    </PageShell>
  )
}
