'use client'

import Link from 'next/link'
import { Mail, LifeBuoy, Shield, Receipt } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { OPERATOR_LINE } from '@/lib/site'
import {
  PUBLIC_HELLO_EMAIL,
  PUBLIC_SUPPORT_EMAIL,
  PUBLIC_PRIVACY_EMAIL,
  PUBLIC_BILLING_EMAIL,
} from '@/lib/relay/catalog'

const inboxes = [
  {
    icon: Mail,
    title: 'General & partnerships',
    email: PUBLIC_HELLO_EMAIL,
    body: 'The main inbox for Nytto Labs and partner inquiries.',
  },
  {
    icon: LifeBuoy,
    title: 'Support',
    email: PUBLIC_SUPPORT_EMAIL,
    body: 'Product support for CycleTag, VIESProof, GateZero, and related tools.',
  },
  {
    icon: Shield,
    title: 'Privacy',
    email: PUBLIC_PRIVACY_EMAIL,
    body: 'Privacy questions and data requests.',
  },
  {
    icon: Receipt,
    title: 'Billing',
    email: PUBLIC_BILLING_EMAIL,
    body: 'Invoices, receipts, and payment questions.',
  },
]

export default function ContactView() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Contact</h1>
        <p className="mt-4 text-[#4a4a3e]">Reach the right inbox directly. {OPERATOR_LINE}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {inboxes.map((item) => (
            <div key={item.email} className="rounded-xl border border-black/10 bg-white p-6">
              <item.icon className="h-5 w-5 text-emerald-800" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-[#4a4a3e]">{item.body}</p>
              <a className="mt-3 inline-block break-all text-sm text-emerald-800 underline" href={`mailto:${item.email}`}>{item.email}</a>
              {item.email === PUBLIC_HELLO_EMAIL && (
                <p className="mt-3">
                  <Link href="/partners" className="text-sm font-medium text-[#1b1b16] underline">Open the partner inquiry form</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
