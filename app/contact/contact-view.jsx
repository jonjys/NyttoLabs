'use client'

import Link from 'next/link'
import { Mail, LifeBuoy, Shield, Receipt } from 'lucide-react'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { FTAX_LINE, OPERATOR_LINE } from '@/lib/site'
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
    body: 'Product support for CycleTag, VIESProof, GateZero, Failclosed, and related tools.',
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
    body: 'Charges, receipts, and payment questions.',
  },
]

const accent = ACCENT.contact

export default function ContactView() {
  return (
    <PageShell
      accent={accent}
      eyebrow="Contact"
      title="A real inbox, not a ticket queue."
      lead={`Reach the right inbox directly. ${OPERATOR_LINE} ${FTAX_LINE}`}
    >
      <section className="mx-auto max-w-3xl px-5 py-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {inboxes.map((item) => (
            <div
              key={item.email}
              className="rounded-2xl p-6 backdrop-blur-sm transition-colors duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.025)',
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  border: `1px solid ${accent}3d`,
                  background: `${accent}14`,
                  color: accent,
                }}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-bold text-white">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {item.body}
              </p>
              <a
                className="mt-3 inline-block break-all text-sm font-medium transition-opacity duration-200 hover:opacity-80"
                style={{ color: accent }}
                href={`mailto:${item.email}`}
              >
                {item.email}
              </a>
              {item.email === PUBLIC_HELLO_EMAIL && (
                <p className="mt-3">
                  <Link
                    href="/partners"
                    className="text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    Open the partner inquiry form
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
