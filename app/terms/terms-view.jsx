'use client'

import PageShell, { ACCENT } from '@/components/site/page-shell'
import { LEGAL_OPERATOR_PARAGRAPH } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

const body = { color: 'rgba(255,255,255,0.5)' }
const h2 = 'mt-9 text-lg font-bold text-white'

export default function TermsView() {
  return (
    <PageShell
      accent={ACCENT.home}
      eyebrow="Terms"
      title="The rules of the road."
      lead="These terms govern use of the Nytto Labs website. Each Nytto Labs product may have its own additional terms."
    >
      <article className="mx-auto max-w-3xl px-5 pb-8 pt-4">
        <div className="space-y-5 text-[15px] leading-relaxed" style={body}>
          <h2 className={h2}>Operator</h2>
          <p>{LEGAL_OPERATOR_PARAGRAPH}</p>

          <h2 className={h2}>Partner links</h2>
          <p>
            Some links lead to independent partner companies. Those companies are solely
            responsible for their products, checkout, payment, delivery, returns, and support.
            Nytto Labs does not hold inventory or process third-party product payments.
          </p>

          <h2 className={h2}>Contact</h2>
          <p>
            Email{' '}
            <a
              className="font-medium transition-opacity hover:opacity-80"
              style={{ color: ACCENT.home }}
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
