'use client'

import Link from 'next/link'
import PageShell from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    title: 'This page is not here.',
    lead: 'The address may have changed, or it never existed. The public site lives at Home, Tools, Custom work, Partners, Contact, Privacy and Terms.',
    home: 'Back to home',
    products: 'See the tools',
  },
  sv: {
    title: 'Den här sidan finns inte.',
    lead: 'Adressen kan ha ändrats, eller så har den aldrig funnits. Webbplatsen består av Hem, Verktyg, Uppdrag, Partner, Kontakt, Integritet och Villkor.',
    home: 'Till startsidan',
    products: 'Se verktygen',
  },
}

export default function NotFoundView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  return (
    <PageShell eyebrow="404" title={t.title} lead={t.lead}>
      <section className="mx-auto max-w-3xl px-5">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="nl-btn">{t.home}</Link>
          <Link href="/products" className="nl-btn nl-btn-ghost">{t.products}</Link>
        </div>
      </section>
    </PageShell>
  )
}
