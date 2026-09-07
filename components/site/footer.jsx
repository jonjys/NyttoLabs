'use client'

import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'
import { FOOTER_IDENTITY_LINE } from '@/lib/site'
import { PUBLIC_HELLO_EMAIL } from '@/lib/relay/catalog'
import { PORTAL_PRODUCTS } from '@/lib/portal/catalog'

export default function SiteFooter() {
  const s = usePublicSettings()
  const helloEmail = s.helloEmail || PUBLIC_HELLO_EMAIL
  const products = PORTAL_PRODUCTS
  return (
    <footer className="border-t border-black/10 bg-[#1b1b16] text-[#d6d4c8]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="text-sm font-semibold tracking-[0.14em] text-white">NYTTO LABS</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9c9a8c]">
              A Swedish software company. Products on this site are proof of what we build — each one keeps its own identity.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#aaa89b]">
              {s.affiliateDisclosure}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">Company</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa89b]">All nine products</div>
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
          <span>© {new Date().getFullYear()} Nytto Labs. All rights reserved.</span>
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
