'use client'

import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { OPERATOR_LINE } from '@/lib/site'
import { PUBLIC_PRIVACY_EMAIL } from '@/lib/relay/catalog'
import { usePublicSettings } from '@/hooks/use-public-catalog'

export default function PrivacyView() {
  const s = usePublicSettings()
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Privacy</h1>
        <div className="prose prose-stone mt-6 space-y-5 text-[#3a3a30]">
          <p>{OPERATOR_LINE} Nytto Labs is built to be privacy-first. Our routing infrastructure is designed to operate on the minimum anonymous commercial context required to route a request — nothing more.</p>
          <h2 className="text-lg font-semibold text-[#1b1b16]">What we do not store</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Names or email addresses of anonymous product users</li>
            <li>Full IP addresses or full user-agent strings</li>
            <li>Complete QR payloads from CycleTag labels</li>
            <li>Personal document content, payment records, or VAT-number lists</li>
            <li>API keys or secrets belonging to product users</li>
          </ul>
          <h2 className="text-lg font-semibold text-[#1b1b16]">What we do store</h2>
          <p>Only anonymous commercial event data needed for routing and attribution: the application slug, an action, a product category / brand / search phrase, a market, an opaque click identifier, and which partner (if any) was selected.</p>
          <h2 className="text-lg font-semibold text-[#1b1b16]">Affiliate disclosure</h2>
          <p>{s.affiliateDisclosure}</p>
          <h2 className="text-lg font-semibold text-[#1b1b16]">Contact</h2>
          <p>Questions about privacy? Email <a className="text-emerald-800 underline" href={`mailto:${PUBLIC_PRIVACY_EMAIL}`}>{PUBLIC_PRIVACY_EMAIL}</a>.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
