'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, Radio } from 'lucide-react'
import { useLocale } from '@/hooks/use-locale'

const COPY = {
  en: {
    links: [
      { href: '/', label: 'Home' },
      { href: '/products', label: 'Products' },
      { href: '/partners', label: 'Partners' },
      { href: '/contact', label: 'Contact' },
    ],
    cta: 'Get in touch',
    open: 'Open menu',
    close: 'Close menu',
  },
  sv: {
    links: [
      { href: '/', label: 'Hem' },
      { href: '/products', label: 'Produkter' },
      { href: '/partners', label: 'Partners' },
      { href: '/contact', label: 'Kontakt' },
    ],
    cta: 'Hör av dig',
    open: 'Öppna menyn',
    close: 'Stäng menyn',
  },
}

function LangSwitch({ locale, setLocale }) {
  return (
    <div className="flex rounded-md border border-black/15 bg-white p-0.5 text-xs font-medium" role="group" aria-label="Language">
      {['en', 'sv'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`min-h-9 min-w-9 rounded px-2 uppercase ${locale === code ? 'bg-[#1b1b16] text-[#f7f5f0]' : 'text-[#6a6858]'}`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [locale, setLocale] = useLocale()
  const toggleRef = useRef(null)
  const pathname = usePathname()
  const t = COPY[locale]
  useEffect(() => { setOpen(false) }, [pathname])
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))
  const showCta = pathname !== '/contact'
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur" onKeyDown={(event) => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus() } }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1b1b16] text-emerald-400">
            <Radio className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[0.14em] text-[#1b1b16]">NYTTO LABS</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Company">
            {t.links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} className={`inline-flex min-h-11 items-center text-sm font-medium transition-colors hover:text-[#1b1b16] ${isActive(l.href) ? 'text-[#1b1b16]' : 'text-[#3a3a30]'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <LangSwitch locale={locale} setLocale={setLocale} />
          {showCta && (
            <Link href="/contact" className="hidden rounded-md bg-[#1b1b16] px-4 py-2 text-sm font-medium text-[#f7f5f0] transition hover:bg-black md:inline-flex">
              {t.cta}
            </Link>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? t.close : t.open}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-nav" className="border-t border-black/10 bg-[#f7f5f0] px-5 py-3 md:hidden">
          {t.links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} onClick={() => setOpen(false)} className={`block min-h-11 py-3 text-sm font-medium ${isActive(l.href) ? 'text-[#1b1b16]' : 'text-[#3a3a30]'}`}>
              {l.label}
            </Link>
          ))}
          {showCta && (
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-md bg-[#1b1b16] px-4 py-3 text-center text-sm font-medium text-[#f7f5f0]">
              {t.cta}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
