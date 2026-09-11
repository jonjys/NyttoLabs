'use client'

import { useRef, useState } from 'react'
import * as Icons from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

const STATUS = {
  live: { color: '#00ff9d', label: 'Live' },
  building: { color: '#ff8a1e', label: 'Building' },
  'public-beta': { color: '#00f5ff', label: 'Public beta' },
  'private-beta': { color: '#8b5cf6', label: 'Private beta' },
  ventures: { color: '#9aa0b5', label: 'Ventures' },
}

function hostLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function ProductCard({ product }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [hover, setHover] = useState(false)

  const Icon = Icons[product.icon] || Icons.Box
  const st = STATUS[product.status] || STATUS.ventures
  const href = product.url
  const host = href ? hostLabel(href) : ''

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({ x: (py - 0.5) * -9, y: (px - 0.5) * 9 })
    setGlare({ x: px * 100, y: py * 100 })
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setTilt({ x: 0, y: 0 })
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl p-6 backdrop-blur-sm"
      style={{
        border: `1px solid ${hover ? `${st.color}4d` : 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(255,255,255,0.025)',
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.18s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hover ? `0 0 44px ${st.color}1f` : 'none',
      }}
    >
      {hover && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.07) 0%, transparent 62%)`,
          }}
        />
      )}

      <div className="relative flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-lg"
          style={{
            border: `1px solid ${st.color}3d`,
            background: `${st.color}14`,
            color: st.color,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
          style={{ border: `1px solid ${st.color}3d`, color: st.color, background: `${st.color}0f` }}
        >
          {st.label}
        </span>
      </div>

      <h3 className="relative mt-5 text-lg font-bold text-white">{product.name}</h3>
      {product.category && (
        <div
          className="relative mt-1 font-mono text-[9px] uppercase tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {product.category}
        </div>
      )}
      <p
        className="relative mt-3 flex-1 text-sm leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.44)' }}
      >
        {product.description}
      </p>

      {product.actions?.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {product.actions.map((a) => (
            <span
              key={a}
              className="rounded-md px-2 py-0.5 text-[11px]"
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-80"
          style={{ color: st.color }}
        >
          Visit {product.name}
          {host && (
            <span className="font-normal" style={{ color: 'rgba(255,255,255,0.28)' }}>
              · {host}
            </span>
          )}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : (
        <p className="relative mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Site coming soon
        </p>
      )}
    </article>
  )
}
