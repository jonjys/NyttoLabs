'use client'

import PageShell, { ACCENT } from '@/components/site/page-shell'
import { FTAX_LINE, OPERATOR_LINE } from '@/lib/site'
import { PUBLIC_PRIVACY_EMAIL } from '@/lib/relay/catalog'
import { usePublicSettings } from '@/hooks/use-public-catalog'

const body = { color: 'rgba(255,255,255,0.5)' }
const h2 = 'mt-9 text-lg font-bold text-white'

export default function PrivacyView() {
  const s = usePublicSettings()
  return (
    <PageShell
      accent={ACCENT.home}
      eyebrow="Privacy"
      title="Privacy-first by design."
      lead={`${OPERATOR_LINE} ${FTAX_LINE}`}
    >
      <article className="mx-auto max-w-3xl px-5 pb-8 pt-4">
        <div className="space-y-5 text-[15px] leading-relaxed" style={body}>
          <p>
            Nytto Labs is built to be privacy-first. Our routing infrastructure is designed to
            operate on the minimum anonymous commercial context required to route a request —
            nothing more.
          </p>
          <p>
            This policy covers the nyttolabs.com website, its routing infrastructure, and partner
            inquiries. Each product handles its own data under its own privacy policy — for example
            Vatidence processes the VAT numbers you submit, GateZero stores encrypted keys, and
            Curl-to-Buy handles uploaded files and payments. See the individual product for the
            details that apply when you use it.
          </p>

          <h2 className={h2}>What the routing layer does not store</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Names or email addresses of anonymous product users</li>
            <li>Full IP addresses or full user-agent strings</li>
            <li>Complete QR payloads from CycleTag labels</li>
            <li>Personal document content, payment records, or VAT-number lists</li>
            <li>API keys or secrets belonging to product users</li>
          </ul>

          <h2 className={h2}>What we do store</h2>
          <p>
            Only anonymous commercial event data needed for routing and attribution: the
            application slug, an action, a product category / brand / search phrase, a market, an
            opaque click identifier, and which partner (if any) was selected.
          </p>

          <h2 className={h2}>Partner inquiries</h2>
          <p>
            When you submit the Partners form, we store the details you enter — company, contact
            name, work email, and the partnership information you provide — solely to evaluate and
            respond to your inquiry. We keep it only as long as needed for that conversation and any
            resulting partnership, and you can ask us to delete it at any time by emailing{' '}
            {PUBLIC_PRIVACY_EMAIL}.
          </p>

          <h2 className={h2}>Affiliate disclosure</h2>
          <p>{s.affiliateDisclosure}</p>

          <h2 className={h2}>Contact</h2>
          <p>
            Questions about privacy? Email{' '}
            <a
              className="font-medium transition-opacity hover:opacity-80"
              style={{ color: ACCENT.home }}
              href={`mailto:${PUBLIC_PRIVACY_EMAIL}`}
            >
              {PUBLIC_PRIVACY_EMAIL}
            </a>
            .
          </p>
        </div>
      </article>
    </PageShell>
  )
}
