'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, Radio } from 'lucide-react'

const links = [
  { href: '/', label: 'Hem' },
  { href: '/products', label: 'Produkter' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Kontakt' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const pathname = usePathname()
  useEffect(() => { setOpen(false) }, [pathname])
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))
  const showCta = pathname !== '/contact'
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur" onKeyDown={(event) => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus() } }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1b1b16] text-emerald-400">
            <Radio className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[0.14em] text-[#1b1b16]">NYTTO LABS</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Company">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} className={`inline-flex min-h-11 items-center text-sm font-medium transition-colors hover:text-[#1b1b16] ${isActive(l.href) ? 'text-[#1b1b16]' : 'text-[#3a3a30]'}`}>
              {l.label}
            </Link>
          ))}
          {showCta && (
            <Link href="/contact" className="rounded-md bg-[#1b1b16] px-4 py-2 text-sm font-medium text-[#f7f5f0] transition hover:bg-black">
              Kontakta oss
            </Link>
          )}
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="border-t border-black/10 bg-[#f7f5f0] px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} onClick={() => setOpen(false)} className={`block min-h-11 py-3 text-sm font-medium ${isActive(l.href) ? 'text-[#1b1b16]' : 'text-[#3a3a30]'}`}>
              {l.label}
            </Link>
          ))}
          {showCta && (
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-md bg-[#1b1b16] px-4 py-3 text-center text-sm font-medium text-[#f7f5f0]">
              Kontakta oss
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
