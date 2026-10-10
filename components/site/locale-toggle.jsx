'use client'

import { useLocale } from '@/hooks/use-locale'

// The one EN/SV switch. It lives in every header (components/site/nav.jsx and
// the landing page header) and writes the shared locale, so every page that
// reads useLocale() switches together.
export default function LocaleToggle({ accent = '#00f5ff', className = '' }) {
  const [locale, setLocale] = useLocale()
  return (
    <div
      role="group"
      aria-label={locale === 'sv' ? 'Språk' : 'Language'}
      className={`inline-flex shrink-0 overflow-hidden rounded-full text-[11px] font-medium ${className}`}
      style={{ border: '1px solid rgba(255,255,255,0.14)' }}
    >
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
          className="min-h-9 min-w-10 px-3 uppercase tracking-wider transition-colors"
          style={locale === value ? { background: accent, color: '#03030c' } : { color: 'rgba(255,255,255,0.6)' }}
        >
          {short}
        </button>
      ))}
    </div>
  )
}
