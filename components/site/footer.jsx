'use client'

import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'

export default function SiteFooter() {
  const s = usePublicSettings()
  const partnerEmail = s.partnerEmail
  const supportEmail = s.supportEmail
  return (
    <footer className="border-t border-black/10 bg-[#1b1b16] text-[#d6d4c8]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-sm font-semibold tracking-[0.14em] text-white">NYTTO LABS</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9c9a8c]">
              Focused software. Invisible infrastructure. Practical outcomes.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#7c7a6e]">
              {s.affiliateDisclosure}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7c7a6e]">Company</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7c7a6e]">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><a href={`mailto:${partnerEmail}`} className="hover:text-white">{partnerEmail}</a></li>
              <li><a href={`mailto:${supportEmail}`} className="hover:text-white">{supportEmail}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#7c7a6e] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {s.legalName || 'Nytto Labs'}. All rights reserved.</span>
          <span>{s.orgNumber ? `Org. no. ${s.orgNumber}` : 'Swedish sole proprietorship (registration in progress).'}</span>
        </div>
      </div>
    </footer>
  )
}
