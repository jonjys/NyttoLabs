'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Boxes, Handshake, BadgeCheck, Layers } from 'lucide-react'
import PageShell, { ACCENT, Eyebrow } from '@/components/site/page-shell'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

const accent = ACCENT.partners

const points = [
  { icon: Boxes, title: 'No inventory held by Nytto Labs', body: 'You keep checkout, payment, VAT, delivery, returns, and product support. We never touch your stock.' },
  { icon: Handshake, title: 'Flexible relationships', body: 'Affiliate links, direct referral agreements, revenue sharing, embedded partnerships, and licensing.' },
  { icon: BadgeCheck, title: 'CycleTag Inside', body: 'Recurring consumables or devices can ship with an embedded reorder path back to your store.' },
  { icon: Layers, title: 'Relevance first', body: 'Partner placement must stay relevant to the user’s intent. Sponsored placements are always disclosed.' },
]

const cardStyle = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.025)',
}

export default function PartnersView() {
  const [form, setForm] = useState({
    company: '', contactName: '', workEmail: '', website: '', markets: '', categories: '',
    affiliateNetwork: '', proposedPartnership: '', message: '', consent: false,
  })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/partner-inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ ok: true, msg: 'Thank you — your inquiry has been received and stored. We will be in touch.' })
        setForm({ company: '', contactName: '', workEmail: '', website: '', markets: '', categories: '', affiliateNetwork: '', proposedPartnership: '', message: '', consent: false })
      } else if (res.status === 503) {
        setStatus({ ok: false, msg: `Inquiries cannot be stored right now. Email ${PUBLIC_HELLO_EMAIL} instead.` })
      } else {
        setStatus({ ok: false, msg: data.error === 'validation' ? 'Please complete the required fields and consent.' : 'Something went wrong. Please try again.' })
      }
    } catch {
      setStatus({ ok: false, msg: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'mt-1.5 min-h-11 w-full rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/20'
  const fieldStyle = {
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
  }
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
      eyebrow="For partners"
      title="Partner with the company behind the products."
      lead="Nytto Labs builds focused products. When a real commercial intent appears in one of them, we can connect that user to a relevant destination — yours. You keep checkout, payment, and fulfilment."
    >
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl p-6 backdrop-blur-sm" style={cardStyle}>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ border: `1px solid ${accent}3d`, background: `${accent}14`, color: accent }}
              >
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Eyebrow accent={accent}>Partner inquiry</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold text-white">Tell us what you sell.</h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Tell us about your products and markets. We’ll assess relevance and follow up.
              Prefer email? Reach us at{' '}
              <a
                className="break-all font-medium transition-opacity hover:opacity-80"
                style={{ color: accent }}
                href={`mailto:${PUBLIC_HELLO_EMAIL}`}
              >
                {PUBLIC_HELLO_EMAIL}
              </a>
              .
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl p-6 backdrop-blur-sm lg:col-span-3"
            style={cardStyle}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls} style={labelStyle}>
                Company*
                <input required {...text('company')} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Contact name*
                <input required {...text('contactName')} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Work email*
                <input required type="email" {...text('workEmail')} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Website
                <input {...text('website', { placeholder: 'https://' })} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Markets
                <input {...text('markets', { placeholder: 'SE, EU, …' })} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Product categories
                <input {...text('categories', { placeholder: 'water-filter, accounting, …' })} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Affiliate network
                <input {...text('affiliateNetwork', { placeholder: 'Awin, direct, …' })} />
              </label>
              <label className={labelCls} style={labelStyle}>
                Proposed partnership
                <input
                  {...text('proposedPartnership', {
                    placeholder: 'affiliate / referral / revshare / licensing',
                  })}
                />
              </label>
            </div>

            <label className={`mt-4 ${labelCls}`} style={labelStyle}>
              Message
              <textarea rows={4} {...text('message')} />
            </label>

            <label
              className="mt-5 flex items-start gap-2.5 text-sm"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ accentColor: accent }}
              />
              <span>I consent to Nytto Labs storing this inquiry to evaluate a potential partnership.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: accent, color: '#03030c' }}
            >
              {submitting ? 'Sending…' : 'Submit inquiry'}
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
