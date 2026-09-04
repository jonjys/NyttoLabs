'use client'

import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { usePublicSettings } from '@/hooks/use-public-catalog'

export default function TermsPage() {
  const s = usePublicSettings()
  const registered = s.orgNumber && s.legalName
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Terms</h1>
        <div className="mt-6 space-y-5 text-[#3a3a30]">
          <p>These terms govern use of the Nytto Labs website. Each Nytto Labs product may have its own additional terms.</p>
          <h2 className="text-lg font-semibold text-[#1b1b16]">Business status</h2>
          {registered ? (
            <p>{s.legalName} — organisation number {s.orgNumber}{s.vatNumber ? `, VAT ${s.vatNumber}` : ''}{s.registeredAddress ? `, ${s.registeredAddress}` : ''}.</p>
          ) : (
            <p>Nytto Labs is currently being established as a Swedish sole proprietorship. Registration and VAT details will be published here once the registration process is complete. Until then we make no claim that registration or VAT approval is finalised.</p>
          )}
          <h2 className="text-lg font-semibold text-[#1b1b16]">Partner links</h2>
          <p>Some links lead to independent partner companies. Those companies are solely responsible for their products, checkout, payment, delivery, returns, and support. Nytto Labs does not hold inventory or process third-party product payments.</p>
          <h2 className="text-lg font-semibold text-[#1b1b16]">Contact</h2>
          <p>Email <a className="text-emerald-800 underline" href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
