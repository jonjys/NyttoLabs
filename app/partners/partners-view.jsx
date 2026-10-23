'use client'

import { useState } from 'react'
import { Boxes, Handshake, BadgeCheck, Layers } from 'lucide-react'
import PageShell, { StatusNote } from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

const ICONS = [Boxes, Handshake, BadgeCheck, Layers]

const COPY = {
  en: {
    points: [
      { title: 'No inventory held by Nytto Labs', body: 'You keep checkout, payment, VAT, delivery, returns, and product support. We never touch your stock.' },
      { title: 'Flexible relationships', body: 'Affiliate links, direct referral agreements, revenue sharing, embedded partnerships, and licensing.' },
      { title: 'StayTag Inside', body: 'Recurring consumables or devices can ship with an embedded reorder path back to your store.' },
      { title: 'Relevance first', body: 'Partner placement must stay relevant to the user’s intent. Sponsored placements are always disclosed.' },
    ],
    eyebrow: 'For partners',
    title: 'Partner with the company behind the products.',
    lead: 'Nytto Labs builds focused products. When a real commercial intent appears in one of them, we can connect that user to a relevant destination — yours. You keep checkout, payment, and fulfilment.',
    formEyebrow: 'Partner inquiry',
    formTitle: 'Tell us what you sell.',
    formBody: 'Tell us about your products and markets. We’ll assess relevance and follow up. Prefer email? Reach us at',
    company: 'Company*', contactName: 'Contact name*', workEmail: 'Work email*', website: 'Website',
    markets: 'Markets', categories: 'Product categories', affiliateNetwork: 'Affiliate network',
    proposed: 'Proposed partnership', message: 'Message',
    marketsPh: 'SE, EU, …', categoriesPh: 'water-filter, accounting, …', networkPh: 'Awin, direct, …',
    proposedPh: 'affiliate / referral / revshare / licensing',
    consent: 'I consent to Nytto Labs storing this inquiry to evaluate a potential partnership.',
    submit: 'Submit inquiry', sending: 'Sending…',
    ok: 'Thank you — your inquiry has been received and stored. We will be in touch.',
    unavailable: `Inquiries cannot be stored right now. Email ${PUBLIC_HELLO_EMAIL} instead.`,
    invalid: 'Please complete the required fields and consent.',
    failed: 'Something went wrong. Please try again.',
    network: 'Network error. Please try again.',
  },
  sv: {
    points: [
      { title: 'Nytto Labs håller inget lager', body: 'Ni behåller kassa, betalning, moms, leverans, returer och produktsupport. Vi rör aldrig ert lager.' },
      { title: 'Flexibla upplägg', body: 'Affiliatelänkar, direkta hänvisningsavtal, intäktsdelning, inbäddade partnerskap och licensiering.' },
      { title: 'StayTag Inside', body: 'Förbrukningsvaror och apparater kan levereras med en inbyggd återköpsväg tillbaka till er butik.' },
      { title: 'Relevans först', body: 'En partnerplacering måste vara relevant för det användaren vill göra. Sponsrade placeringar redovisas alltid.' },
    ],
    eyebrow: 'För partner',
    title: 'Samarbeta med företaget bakom produkterna.',
    lead: 'Nytto Labs bygger fokuserade produkter. När ett verkligt köpbehov uppstår i någon av dem kan vi skicka användaren vidare till ett relevant mål — ert. Ni behåller kassa, betalning och leverans.',
    formEyebrow: 'Partnerförfrågan',
    formTitle: 'Berätta vad ni säljer.',
    formBody: 'Berätta om era produkter och marknader. Vi bedömer om det passar och återkommer. Hellre mejl? Nå oss på',
    company: 'Företag*', contactName: 'Kontaktperson*', workEmail: 'Jobbmejl*', website: 'Webbplats',
    markets: 'Marknader', categories: 'Produktkategorier', affiliateNetwork: 'Affiliatenätverk',
    proposed: 'Föreslaget samarbete', message: 'Meddelande',
    marketsPh: 'SE, EU, …', categoriesPh: 'vattenfilter, bokföring, …', networkPh: 'Awin, direkt, …',
    proposedPh: 'affiliate / hänvisning / intäktsdelning / licens',
    consent: 'Jag samtycker till att Nytto Labs sparar förfrågan för att bedöma ett möjligt partnerskap.',
    submit: 'Skicka förfrågan', sending: 'Skickar…',
    ok: 'Tack — er förfrågan har tagits emot och sparats. Vi hör av oss.',
    unavailable: `Förfrågningar kan inte sparas just nu. Mejla ${PUBLIC_HELLO_EMAIL} i stället.`,
    invalid: 'Fyll i de obligatoriska fälten och ge ditt samtycke.',
    failed: 'Något gick fel. Försök igen.',
    network: 'Nätverksfel. Försök igen.',
  },
}

export default function PartnersView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  const points = t.points.map((p, i) => ({ ...p, icon: ICONS[i] }))
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
        setStatus({ ok: true, msg: t.ok })
        setForm({ company: '', contactName: '', workEmail: '', website: '', markets: '', categories: '', affiliateNetwork: '', proposedPartnership: '', message: '', consent: false })
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} className="nl-card p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas-2 text-ink">
                <p.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-ink">{p.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="nl-label">{t.formEyebrow}</p>
            <h2 className="mt-4 text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">{t.formTitle}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              {t.formBody}{' '}
              <a className="nl-link break-all font-medium text-ink" href={`mailto:${PUBLIC_HELLO_EMAIL}`}>
                {PUBLIC_HELLO_EMAIL}
              </a>
              .
            </p>
          </div>

          <form onSubmit={submit} className="nl-card p-6 sm:p-8 lg:col-span-3">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelCls}>
                {t.company}
                <input required {...text('company')} />
              </label>
              <label className={labelCls}>
                {t.contactName}
                <input required {...text('contactName')} />
              </label>
              <label className={labelCls}>
                {t.workEmail}
                <input required type="email" {...text('workEmail')} />
              </label>
              <label className={labelCls}>
                {t.website}
                <input {...text('website', { placeholder: 'https://' })} />
              </label>
              <label className={labelCls}>
                {t.markets}
                <input {...text('markets', { placeholder: t.marketsPh })} />
              </label>
              <label className={labelCls}>
                {t.categories}
                <input {...text('categories', { placeholder: t.categoriesPh })} />
              </label>
              <label className={labelCls}>
                {t.affiliateNetwork}
                <input {...text('affiliateNetwork', { placeholder: t.networkPh })} />
              </label>
              <label className={labelCls}>
                {t.proposed}
                <input {...text('proposedPartnership', { placeholder: t.proposedPh })} />
              </label>
            </div>

            <label className={`mt-5 ${labelCls}`}>
              {t.message}
              <textarea rows={4} {...text('message')} />
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
              {submitting ? t.sending : t.submit}
            </button>

            <StatusNote status={status} />
          </form>
        </div>
      </section>
    </PageShell>
  )
}
