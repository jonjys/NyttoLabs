'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import s from './landing.module.css'

// Hero background: "intent" particles stream from the pointer (or a drifting
// source when there is no pointer) and get routed to one node per product —
// a visual metaphor for Relay. Pure canvas 2D, no dependencies.
// Performance guards: DPR capped at 2, particle cap, pauses when off-screen or
// the tab is hidden, and a single static frame under prefers-reduced-motion.

export interface FieldNode {
  label: string
  color: string
  /** In-page anchor the node links to. */
  href: string
}

/**
 * Layout mode. "overlay": wide screens, the field sits behind the hero with
 * nodes on an arc to the right of the copy. "band": below 1280px the field is
 * its own panel under the copy (see .heroCanvas in the CSS) with nodes in a row.
 * Must match the CSS breakpoint.
 */
export const OVERLAY_QUERY = '(min-width: 1280px)'

type Layout = 'overlay' | 'row' | 'grid'

function layoutFor(canvasWidth: number): Layout {
  if (window.matchMedia(OVERLAY_QUERY).matches) return 'overlay'
  // Narrow panels (phones) use a 2x2 grid so labels never collide.
  return canvasWidth < 560 ? 'grid' : 'row'
}

/** Node position as fractions of the canvas size (shared by canvas and links). */
function nodeFrac(i: number, count: number, layout: Layout): { x: number; y: number } {
  const f = count === 1 ? 0.5 : i / (count - 1)
  if (layout === 'grid') {
    const cols = 2
    const rows = Math.ceil(count / cols)
    const y = 0.26 + (rows > 1 ? Math.floor(i / cols) / (rows - 1) : 0.4) * 0.52
    // A lone node on the last row is centred instead of hanging on the left.
    const lone = i === count - 1 && count % cols === 1
    return { x: lone ? 0.5 : 0.27 + (i % cols) * 0.46, y }
  }
  if (layout === 'row') return { x: 0.14 + f * 0.72, y: 0.46 }
  return { x: 0.9 - Math.sin(f * Math.PI) * 0.1, y: 0.16 + f * 0.68 }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  target: number
  life: number
  trail: { x: number; y: number }[]
}

const MAX_PARTICLES = 120
const TRAIL = 7

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function SignalField({ nodes }: { nodes: FieldNode[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const hoverRef = useRef<number | null>(null)
  const burstRef = useRef<((i: number) => void) | null>(null)
  const [layout, setLayout] = useState<Layout>('overlay')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let mode: Layout = layoutFor(canvas.getBoundingClientRect().width)
    let isBand = mode !== 'overlay'
    let height = 0
    let dpr = 1
    let raf = 0
    let running = false
    let visible = true
    let t = 0
    const pointer = { x: 0, y: 0, active: false }
    const particles: Particle[] = []
    const hits: number[] = []

    const nodePos = (i: number, count: number) => {
      const f = nodeFrac(i, count, mode)
      return { x: width * f.x, y: height * f.y }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mode = layoutFor(width)
      isBand = mode !== 'overlay'
      setLayout(mode)
    }

    const spawn = (from?: { x: number; y: number }, target?: number) => {
      const count = nodesRef.current.length
      if (!count) return
      const src = from
        ? from
        : pointer.active
        ? pointer
        : isBand
        ? { x: width * (0.5 + Math.sin(t * 0.0007) * 0.35), y: height * (0.9 + Math.cos(t * 0.0011) * 0.05) }
        : { x: width * (0.66 + Math.sin(t * 0.0006) * 0.08), y: height * (0.5 + Math.cos(t * 0.0009) * 0.3) }
      const angle = Math.random() * Math.PI * 2
      const speed = 0.6 + Math.random() * 1.4
      particles.push({
        x: src.x + (Math.random() - 0.5) * 24,
        y: src.y + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        target: target ?? Math.floor(Math.random() * count),
        life: 0,
        trail: [],
      })
    }

    const drawGrid = () => {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      const step = 28
      const ox = pointer.active ? (pointer.x / width - 0.5) * 6 : 0
      const oy = pointer.active ? (pointer.y / height - 0.5) * 6 : 0
      for (let x = (ox % step) + step / 2; x < width; x += step) {
        for (let y = (oy % step) + step / 2; y < height; y += step) {
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    const drawNodes = () => {
      const list = nodesRef.current
      ctx.font = '500 10px ui-monospace, SFMono-Regular, monospace'
      ctx.textBaseline = 'middle'
      list.forEach((node, i) => {
        const p = nodePos(i, list.length)
        const [r, g, b] = hexToRgb(node.color)
        const pulse = hits[i] ?? 0
        const hover = hoverRef.current === i ? 1 : 0
        const radius = 5 + pulse * 6 + hover * 3
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 34 + pulse * 20)
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.28 + pulse * 0.3})`)
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 34 + pulse * 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius + 6 + hover * 4, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = hover ? `rgb(${r},${g},${b})` : 'rgba(255,255,255,0.6)'
        if (isBand) {
          ctx.textAlign = 'center'
          ctx.fillText(node.label.toUpperCase(), p.x, p.y + 30)
        } else {
          ctx.textAlign = 'right'
          ctx.fillText(node.label.toUpperCase(), p.x - 18, p.y)
        }
        hits[i] = Math.max(0, pulse - 0.04)
      })
    }

    const step = () => {
      const list = nodesRef.current
      if (particles.length < MAX_PARTICLES) {
        spawn()
        if (pointer.active) spawn()
      }
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const pt = particles[i]
        const target = nodePos(pt.target, list.length)
        const dx = target.x - pt.x
        const dy = target.y - pt.y
        const dist = Math.hypot(dx, dy) || 1
        // Steer towards the node, with a perpendicular swirl for curved routes.
        const pull = Math.min(0.12, 0.02 + pt.life * 0.0012)
        pt.vx += (dx / dist) * pull * 2 - (dy / dist) * 0.05
        pt.vy += (dy / dist) * pull * 2 + (dx / dist) * 0.05
        pt.vx *= 0.94
        pt.vy *= 0.94
        pt.x += pt.vx * 2
        pt.y += pt.vy * 2
        pt.life += 1
        pt.trail.push({ x: pt.x, y: pt.y })
        if (pt.trail.length > TRAIL) pt.trail.shift()
        if (dist < 10 || pt.life > 600) {
          if (dist < 10) hits[pt.target] = 1
          particles.splice(i, 1)
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      drawGrid()
      const list = nodesRef.current
      for (const pt of particles) {
        const node = list[pt.target]
        if (!node || pt.trail.length < 2) continue
        const [r, g, b] = hexToRgb(node.color)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(pt.trail[0].x, pt.trail[0].y)
        for (const p of pt.trail) ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      drawNodes()
    }

    const loop = (now: number) => {
      t = now
      step()
      draw()
      raf = running ? requestAnimationFrame(loop) : 0
    }

    // The animation waits until the browser is idle after first paint, so it
    // never competes with the hero text for the main thread (LCP / TBT).
    let ready = false
    const start = () => {
      if (!ready || running || reduced || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height
    }
    const onLeave = () => {
      pointer.active = false
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    // Clicking a node: a burst of intents converges on it.
    burstRef.current = (i: number) => {
      hits[i] = 1
      const p = nodePos(i, nodesRef.current.length)
      for (let k = 0; k < 28; k += 1) {
        const a = (k / 28) * Math.PI * 2
        spawn({ x: p.x + Math.cos(a) * 90, y: p.y + Math.sin(a) * 90 }, i)
      }
      if (reduced) {
        for (let k = 0; k < 30; k += 1) step()
        draw()
      }
    }

    resize()
    if (reduced) {
      // One static frame: routes drawn as settled particles.
      for (let i = 0; i < 60; i += 1) spawn()
      for (let i = 0; i < 40; i += 1) step()
      draw()
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    const begin = () => {
      ready = true
      start()
    }
    // Safari < 18 has no requestIdleCallback; fall back to a short timeout.
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const idle = hasIdle ? window.requestIdleCallback(begin, { timeout: 1500 }) : window.setTimeout(begin, 600)

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const onNodeClick = (e: MouseEvent<HTMLAnchorElement>, i: number, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    burstRef.current?.(i)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Let the burst land before scrolling to the product.
    e.preventDefault()
    window.setTimeout(() => {
      window.location.hash = href
    }, 220)
  }

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {/* Real links over the canvas nodes, so they work by mouse, touch and keyboard. */}
      {nodes.map((node, i) => {
          const f = nodeFrac(i, nodes.length, layout)
          return (
            <a
              key={node.href}
              href={node.href}
              className={s.fieldNode}
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
              aria-label={`Jump to ${node.label}`}
              title={node.label}
              onPointerDown={() => (hoverRef.current = i)}
              onMouseEnter={() => (hoverRef.current = i)}
              onMouseLeave={() => (hoverRef.current = null)}
              onFocus={() => (hoverRef.current = i)}
              onBlur={() => (hoverRef.current = null)}
              onClick={(e) => onNodeClick(e, i, node.href)}
            />
          )
        })}
    </>
  )
}
