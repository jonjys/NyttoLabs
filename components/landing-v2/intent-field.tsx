'use client'

import { useEffect, useRef } from 'react'

/** Cursor-reactive particle network behind the hero ("every particle is an intent being routed"). */
export default function IntentField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, dpr = 1, raf = 0
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
    }
    size()

    const N = 110
    const hues = ['0,245,255', '255,43,209', '0,255,157']
    const P = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006,
      r: 0.6 + Math.random() * 1.4,
      hue: Math.random() < 0.8 ? hues[0] : hues[1 + Math.floor(Math.random() * 2)],
    }))
    const mouse = { x: -1, y: -1 }
    const onMove = (e: PointerEvent) => {
      const b = c.getBoundingClientRect()
      mouse.x = (e.clientX - b.left) / b.width
      mouse.y = (e.clientY - b.top) / b.height
    }

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const p of P) {
        if (mouse.x >= 0) {
          const dx = mouse.x - p.x, dy = (mouse.y - p.y) * (h / w)
          const d2 = dx * dx + dy * dy
          if (d2 < 0.06) { const f = 0.00004 / (d2 + 0.004); p.vx += dx * f; p.vy += dy * f * (w / h) }
        }
        p.vx *= 0.985; p.vy *= 0.985
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        p.x = Math.min(1, Math.max(0, p.x)); p.y = Math.min(1, Math.max(0, p.y))
      }
      ctx.lineWidth = 1
      for (let i = 0; i < N; i++) {
        const a = P[i]
        for (let j = i + 1; j < N; j++) {
          const b = P[j]
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h
          const d = dx * dx + dy * dy
          if (d < 12000) {
            ctx.strokeStyle = `rgba(0,245,255,${(0.16 * (1 - d / 12000)).toFixed(3)})`
            ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke()
          }
        }
      }
      for (const p of P) {
        ctx.fillStyle = `rgba(${p.hue},0.75)`
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', size)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
