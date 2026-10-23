'use client'

import Link from 'next/link'
import SiteNav from './nav'
import SiteFooter from './footer'
import { useLocale } from '@/hooks/use-locale'

// Every public page: the shared header and footer around the content, and an
// optional page header (breadcrumb, title, lead). The home page renders its
// own hero, so it passes no title.
export default function PageShell({ eyebrow, title, lead, wide = false, aside = null, children }) {
  const [locale] = useLocale()
  const width = wide ? 'max-w-6xl' : 'max-w-3xl'
  return (
    <div className="nl-canvas relative flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        {(eyebrow || title) && (
          <header className="relative overflow-hidden">
            {/* A soft wash of the AI colours behind the title. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[620px] rounded-full opacity-[0.16] blur-[90px]"
              style={{ background: 'var(--nl-ai)' }}
            />
            <div className={`relative mx-auto ${width} px-5 pb-12 pt-12 sm:pt-20`}>
              <nav aria-label={locale === 'sv' ? 'Brödsmulor' : 'Breadcrumb'} className="nl-label">
                <Link href="/" className="inline-flex min-h-9 items-center text-ink-2 transition-colors hover:text-ink">Nytto Labs</Link>
                <span aria-hidden className="text-line">/</span>
                <span>{eyebrow}</span>
              </nav>
              <div className={aside ? 'mt-5 grid items-end gap-8 lg:grid-cols-[1fr_auto]' : 'mt-5'}>
                <div>
                  {title && (
                    <h1
                      className="max-w-4xl font-semibold leading-[1] tracking-[-0.04em] text-ink"
                      style={{ fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)' }}
                    >
                      {title}
                    </h1>
                  )}
                  {lead && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{lead}</p>}
                </div>
                {aside}
              </div>
            </div>
          </header>
        )}
        {children}
      </main>

      <SiteFooter />
    </div>
  )
}

// The result of a form submission.
export function StatusNote({ status }) {
  if (!status) return null
  return (
    <p
      role="status"
      className={`mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[15px] ${
        status.ok ? 'bg-[rgba(15,122,69,0.08)] text-live' : 'bg-[rgba(200,40,60,0.07)] text-[#b42335]'
      }`}
    >
      <span aria-hidden className="mt-px font-semibold">{status.ok ? '✓' : '!'}</span>
      <span>{status.msg}</span>
    </p>
  )
}
