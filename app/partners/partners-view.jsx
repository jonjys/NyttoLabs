'use client'

import { useState } from 'react'
import { CheckCircle2, Boxes, Handshake, BadgeCheck, Layers } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

const points = [
  { icon: Boxes, title: 'No inventory held by Nytto Labs', body: 'You keep checkout, payment, VAT, delivery, returns, and product support. We never touch your stock.' },
  { icon: Handshake, title: 'Flexible relationships', body: 'Affiliate links, direct referral agreements, revenue sharing, embedded partnerships, and licensing.' },
  { icon: BadgeCheck, title: 'CycleTag Inside', body: 'Recurring consumables or devices can ship with an embedded reorder path back to your store.' },
  { icon: Layers, title: 'Relevance first', body: 'Partner placement must stay relevant to the user’s intent. Sponsored placements are always disclosed.' },
]

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

  const field = 'mt-1 min-h-11 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700'

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-8">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#6a6858]">For partners</span>
        <h1 className="mt-5 max-w-3xl font-serif text-3xl font-normal tracking-tight sm:text-4xl">
          Partner with the company behind the products.
        </h1>
        <p className="mt-4 max-w-2xl text-[#4a4a3e]">
          Nytto Labs builds focused products. When a real commercial intent appears in one of them,
          we can connect that user to a relevant destination — yours. You keep checkout, payment, and fulfilment.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-xl border border-black/10 bg-white p-6">
              <p.icon className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a4a3e]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">Partner inquiry</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">
              Tell us about your products and markets. We’ll assess relevance and follow up.
              Prefer email? Reach us at <a className="break-all text-emerald-800 underline" href={`mailto:${PUBLIC_HELLO_EMAIL}`}>{PUBLIC_HELLO_EMAIL}</a>.
            </p>
          </div>
          <form onSubmit={submit} className="rounded-xl border border-black/10 bg-white p-6 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Company*
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
              </label>
              <label className="text-sm font-medium">Contact name*
                <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className={field} />
              </label>
              <label className="text-sm font-medium">Work email*
                <input required type="email" value={form.workEmail} onChange={(e) => setForm({ ...form, workEmail: e.target.value })} className={field} />
              </label>
              <label className="text-sm font-medium">Website
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={field} placeholder="https://" />
              </label>
              <label className="text-sm font-medium">Markets
                <input value={form.markets} onChange={(e) => setForm({ ...form, markets: e.target.value })} className={field} placeholder="SE, EU, ..." />
              </label>
              <label className="text-sm font-medium">Product categories
                <input value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} className={field} placeholder="water-filter, accounting, ..." />
              </label>
              <label className="text-sm font-medium">Affiliate network
                <input value={form.affiliateNetwork} onChange={(e) => setForm({ ...form, affiliateNetwork: e.target.value })} className={field} placeholder="Awin, direct, ..." />
              </label>
              <label className="text-sm font-medium">Proposed partnership
                <input value={form.proposedPartnership} onChange={(e) => setForm({ ...form, proposedPartnership: e.target.value })} className={field} placeholder="affiliate / referral / revshare / licensing" />
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">Message
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
            </label>
            <label className="mt-4 flex items-start gap-2 text-sm text-[#4a4a3e]">
              <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4" />
              <span>I consent to Nytto Labs storing this inquiry to evaluate a potential partnership.</span>
            </label>
            <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] transition hover:bg-black disabled:opacity-60">
              {submitting ? 'Sending…' : 'Submit inquiry'}
            </button>
            {status && (
              <div className={`mt-4 flex items-start gap-2 rounded-md px-3 py-2 text-sm ${status.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                {status.ok && <CheckCircle2 className="mt-0.5 h-4 w-4" />}<span>{status.msg}</span>
              </div>
            )}
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
