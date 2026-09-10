'use client'

import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'

export default function SiteFooter() {
  const s = usePublicSettings()
  const helloEmail = s.helloEmail || PUBLIC_HELLO_EMAIL
  return (
    <footer className="border-t border-black/10 bg-[#1b1b16] text-[#d6d4c8]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="text-sm font-semibold tracking-[0.14em] text-white">NYTTO LABS</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9c9a8c]">
              Svenskt mjukvarubolag. Varje produkt lever under eget namn och egen sajt.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#aaa89b]">
              {s.affiliateDisclosure}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">Företag</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Hem</Link></li>
              <li><Link href="/products" className="hover:text-white">Produkter</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link href="/contact" className="hover:text-white">Kontakt</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Integritetspolicy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Villkor</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">Produkter</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://cycletag.eu/" className="inline-flex min-h-8 items-center hover:text-white">CycleTag</a></li>
              <li><a href="https://viesproof.eu/" className="inline-flex min-h-8 items-center hover:text-white">VIESproof</a></li>
              <li><Link href="/products" className="inline-flex min-h-8 items-center text-[#9c9a8c] hover:text-white">Alla produkter →</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#aaa89b] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Nytto Labs. Alla rättigheter förbehållna.</span>
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
