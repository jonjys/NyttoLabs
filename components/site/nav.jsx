'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Radio } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f5f0]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1b1b16] text-emerald-400">
            <Radio className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[0.14em] text-[#1b1b16]">NYTTO LABS</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-[#3a3a30] transition-colors hover:text-[#1b1b16]">
              {l.label}
            </Link>
          ))}
          <Link href="/partners" className="rounded-md bg-[#1b1b16] px-4 py-2 text-sm font-medium text-[#f7f5f0] transition hover:bg-black">
            Become a partner
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-black/10 bg-[#f7f5f0] px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-[#3a3a30]">
              {l.label}
            </Link>
          ))}
          <Link href="/partners" onClick={() => setOpen(false)} className="mt-2 block rounded-md bg-[#1b1b16] px-4 py-2 text-center text-sm font-medium text-[#f7f5f0]">
            Become a partner
          </Link>
        </div>
      )}
    </header>
  )
}
