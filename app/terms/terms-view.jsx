'use client'

import PageShell from '@/components/site/page-shell'
import { LEGAL_OPERATOR_PARAGRAPH } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { useLocale } from '@/hooks/use-locale'

const h2 = 'pt-6 text-xl font-semibold tracking-[-0.02em] text-ink'

const COPY = {
  en: {
    eyebrow: 'Terms',
    title: 'The rules of the road.',
    lead: 'These terms govern use of the Nytto Labs website. Each Nytto Labs product may have its own additional terms.',
    operator: 'Operator',
    operatorText: LEGAL_OPERATOR_PARAGRAPH,
    partnerLinks: 'Partner links',
    partnerLinksText:
      'Some links lead to independent partner companies. Those companies are solely responsible for their products, checkout, payment, delivery, returns, and support. Nytto Labs does not hold inventory or process third-party product payments.',
    contact: 'Contact',
    email: 'Email',
  },
  sv: {
    eyebrow: 'Villkor',
    title: 'Spelreglerna.',
    lead: 'Dessa villkor gäller för användningen av Nytto Labs webbplats. Varje produkt från Nytto Labs kan ha egna, kompletterande villkor. Vid skillnader mellan språkversionerna gäller den engelska.',
    operator: 'Verksamhetsutövare',
    operatorText:
      'Nytto Labs drivs av Fredrik Kornelind (Sverige). Svensk enskild näringsidkare. Godkänd för F‑skatt. Momsregistrerad.',
    partnerLinks: 'Partnerlänkar',
    partnerLinksText:
      'Vissa länkar leder till fristående partnerföretag. Dessa företag ansvarar själva för sina produkter, kassa, betalning, leverans, returer och support. Nytto Labs håller inget lager och hanterar inte betalningar för tredje parts produkter.',
    contact: 'Kontakt',
    email: 'Mejla',
  },
}

export default function TermsView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  return (
    <PageShell eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <article className="mx-auto max-w-3xl px-5 pt-2">
        <div className="nl-card space-y-5 p-6 text-[16px] leading-relaxed text-ink-2 sm:p-10">
          <h2 className={h2}>{t.operator}</h2>
          <p>{t.operatorText}</p>

          <h2 className={h2}>{t.partnerLinks}</h2>
          <p>{t.partnerLinksText}</p>

          <h2 className={h2}>{t.contact}</h2>
          <p>
            {t.email}{' '}
            <a
              className="nl-link font-medium text-ink"
              href={`mailto:${PUBLIC_HELLO_EMAIL}`}
            >
              {PUBLIC_HELLO_EMAIL}
            </a>
            .
          </p>
        </div>
      </article>
    </PageShell>
  )
}
