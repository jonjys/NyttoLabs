'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/hooks/use-locale'
import LocaleToggle from './locale-toggle'
import Logo from './logo'
import { SITE_NAV_CTA, SITE_NAV_LINKS, navLabel } from './nav-links'

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const pathname = usePathname()
  const [locale] = useLocale()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const isActive = (href) => pathname?.startsWith(href)
  const showCta = pathname !== SITE_NAV_CTA.href

  return (
    // A floating bar that sharpens once the page scrolls under it.
    <header
      className="sticky top-0 z-40 px-3 pt-3 sm:px-5"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          toggleRef.current?.focus()
        }
      }}
    >
      <div
        className={`mx-auto max-w-6xl rounded-[22px] backdrop-blur-xl transition-all duration-300 ${
          scrolled || open
            ? 'bg-[rgba(255,255,255,0.82)] shadow-[0_0_0_1px_var(--nl-line),0_12px_32px_-18px_rgba(12,12,14,0.3)]'
            : 'bg-[rgba(255,255,255,0)] shadow-[0_0_0_1px_rgba(227,227,222,0)]'
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-4 pl-4 pr-2 sm:pl-5">
          <Link href="/" className="flex min-h-11 items-center" aria-label={locale === 'sv' ? 'Nytto Labs, startsidan' : 'Nytto Labs, home'}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label={locale === 'sv' ? 'Huvudmeny' : 'Main'}>
            {SITE_NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-3.5 text-[14.5px] transition-colors ${
                  isActive(l.href) ? 'bg-canvas-2 text-ink' : 'text-ink-2 hover:bg-canvas-2 hover:text-ink'
                }`}
              >
                {navLabel(l, locale)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LocaleToggle />
            {showCta && (
              <Link href={SITE_NAV_CTA.href} className="nl-btn nl-btn-sm">
                {navLabel(SITE_NAV_CTA, locale)}
              </Link>
            )}
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? (locale === 'sv' ? 'Stäng menyn' : 'Close menu') : (locale === 'sv' ? 'Öppna menyn' : 'Open menu')}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="px-4 pb-4 md:hidden">
            {SITE_NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between border-t border-line text-[17px] font-medium text-ink"
              >
                {navLabel(l, locale)}
                <span aria-hidden className="text-faded">→</span>
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-4">
              <LocaleToggle />
              {showCta && (
                <Link href={SITE_NAV_CTA.href} onClick={() => setOpen(false)} className="nl-btn nl-btn-sm">
                  {navLabel(SITE_NAV_CTA, locale)}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
