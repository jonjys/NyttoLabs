import { useId } from 'react'

// The Nytto Labs mark: an ink tile with the N cut out of it and a dot in the
// AI gradient. Same drawing as app/icon.svg.
export function LogoMark({ size = 28, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={className}>
      <defs>
        <linearGradient id={`nl-dot-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b43f0" />
          <stop offset="0.55" stopColor="#ff5c8a" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="var(--nl-ink)" />
      <path d="M17 47V17h7.5l15 19.5V17H47v30h-7.5l-15-19.5V47z" fill="var(--nl-on-ink)" />
      <circle cx="51" cy="13" r="5.5" fill={`url(#nl-dot-${id})`} />
    </svg>
  )
}

export default function Logo({ size = 28 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-[16px] font-semibold tracking-[-0.015em] text-ink">Nytto Labs</span>
    </span>
  )
}
