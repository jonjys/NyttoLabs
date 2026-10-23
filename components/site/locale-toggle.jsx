'use client'

import { useLocale } from '@/hooks/use-locale'

// The one EN/SV switch. It lives in the site header (components/site/nav.jsx)
// and writes the shared locale, so every page that reads useLocale()
// switches together.
export default function LocaleToggle({ className = '' }) {
  const [locale, setLocale] = useLocale()
  return (
    <div
      role="group"
      aria-label={locale === 'sv' ? 'Språk' : 'Language'}
      className={`relative inline-flex shrink-0 rounded-full bg-canvas-2 p-[3px] font-mono text-[11px] font-medium ${className}`}
    >
      {/* The thumb slides between the two options. */}
      <span
        aria-hidden
        className="absolute bottom-[3px] top-[3px] w-[calc(50%-3px)] rounded-full bg-surface shadow-[0_1px_2px_rgba(12,12,14,0.12)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.3,1.3,0.5,1)]"
        style={{ transform: locale === 'sv' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {[
        ['en', 'EN', 'English'],
        ['sv', 'SV', 'Svenska'],
      ].map(([value, short, name]) => (
        <button
          key={value}
          type="button"
          lang={value}
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          aria-label={name}
          className={`relative min-h-8 min-w-10 rounded-full px-2.5 tracking-wider transition-colors ${
            locale === value ? 'text-ink' : 'text-faded hover:text-ink'
          }`}
        >
          {short}
        </button>
      ))}
    </div>
  )
}
