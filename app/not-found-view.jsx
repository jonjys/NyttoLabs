'use client'

import Link from 'next/link'
import PageShell, { ACCENT } from '@/components/site/page-shell'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    title: 'This page is not here.',
    lead: 'The address may have changed, or it never existed. The public site lives at Home, Products, Partners, Contact, Privacy, and Terms.',
    home: 'Back to home',
    products: 'Products',
  },
  sv: {
    title: 'Den här sidan finns inte.',
    lead: 'Adressen kan ha ändrats, eller så har den aldrig funnits. Webbplatsen består av Hem, Produkter, Partner, Kontakt, Integritet och Villkor.',
    home: 'Till startsidan',
    products: 'Produkter',
  },
}

export default function NotFoundView() {
  const [locale] = useLocale()
  const t = COPY[locale] || COPY.en
  return (
    <PageShell accent={ACCENT.home} eyebrow="404" title={t.title} lead={t.lead}>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-lg px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: ACCENT.home, color: '#03030c' }}
          >
            {t.home}
          </Link>
          <Link
            href="/products"
            className="rounded-lg px-6 py-3 text-sm font-medium transition-colors duration-200 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.6)' }}
          >
            {t.products}
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
