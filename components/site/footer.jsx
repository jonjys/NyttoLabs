'use client'

import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { PORTAL_PRODUCTS } from '@/lib/portal/catalog'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    blurb: 'A Swedish software company. Products on this site are proof of what we build — each one keeps its own identity.',
    company: 'Company',
    home: 'Home',
    products: 'Products',
    partners: 'Partners',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    all: 'All products',
    rights: 'All rights reserved.',
  },
  sv: {
    blurb: 'Ett svenskt mjukvarubolag. Produkterna på den här sajten är bevis på vad vi bygger — var och en behåller sin identitet.',
    company: 'Bolag',
    home: 'Hem',
    products: 'Produkter',
    partners: 'Partners',
    contact: 'Kontakt',
    privacy: 'Integritet',
    terms: 'Villkor',
    all: 'Alla produkter',
    rights: 'Alla rättigheter förbehållna.',
  },
}

export default function SiteFooter() {
  const [locale] = useLocale()
  const t = COPY[locale]
  const s = usePublicSettings()
  const helloEmail = s.helloEmail || PUBLIC_HELLO_EMAIL
  const products = PORTAL_PRODUCTS
  return (
    <footer className="border-t border-black/10 bg-[#1b1b16] text-[#d6d4c8]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="text-sm font-semibold tracking-[0.14em] text-white">NYTTO LABS</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9c9a8c]">{t.blurb}</p>
            <p className="mt-4 text-xs leading-relaxed text-[#aaa89b]">
              {s.affiliateDisclosure}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">{t.company}</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">{t.home}</Link></li>
              <li><Link href="/products" className="hover:text-white">{t.products}</Link></li>
              <li><Link href="/partners" className="hover:text-white">{t.partners}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t.contact}</Link></li>
              <li><Link href="/privacy" className="hover:text-white">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white">{t.terms}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">{t.all}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <a href={p.url} className="inline-flex min-h-8 items-center hover:text-white">{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#aaa89b] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Nytto Labs. {t.rights}</span>
          <span>
            {FOOTER_IDENTITY_LINE}
            {' · '}
            <a href={`mailto:${helloEmail}`} className="hover:text-white">{helloEmail}</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
