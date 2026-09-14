'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteNav({ accent = '#00f5ff' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))
  const showCta = pathname !== '/contact'

  return (
    // A floating glass capsule, inset from the top edge, so the chrome reads
    // the same way on every page — including the 3D lobby's own header —
    // rather than a full-width bar that only appears once you scroll.
    <header
      className="sticky top-4 z-40 px-4 sm:top-6"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          toggleRef.current?.focus()
        }
      }}
    >
      <div
        className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full px-5 backdrop-blur-xl transition-shadow duration-300 sm:px-6 2xl:max-w-[1100px]"
        style={{
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(3,3,12,0.6)',
          boxShadow: scrolled || open ? '0 12px 40px rgba(0,0,0,0.4)' : '0 6px 24px rgba(0,0,0,0.25)',
        }}
      >
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded"
            style={{ background: accent, boxShadow: `0 0 14px ${accent}99` }}
          >
            <span className="block h-2 w-2 rounded-full" style={{ background: '#03030c' }} />
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-white">NYTTO LABS</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Company">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className="inline-flex min-h-11 items-center text-sm transition-colors duration-200 hover:text-white"
              style={{ color: isActive(l.href) ? '#fff' : 'rgba(255,255,255,0.45)' }}
            >
              {l.label}
            </Link>
          ))}
          {showCta && (
            <Link
              href="/contact"
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
              style={{ border: `1px solid ${accent}59`, color: accent }}
            >
              Get in touch
            </Link>
          )}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="mx-auto mt-2 max-w-4xl rounded-2xl px-5 py-3 backdrop-blur-xl md:hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(3,3,12,0.82)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className="block min-h-11 py-3 text-sm font-medium"
              style={{ color: isActive(l.href) ? '#fff' : 'rgba(255,255,255,0.5)' }}
            >
              {l.label}
            </Link>
          ))}
          {showCta && (
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full px-4 py-3 text-center text-sm font-bold"
              style={{ background: accent, color: '#03030c' }}
            >
              Get in touch
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
