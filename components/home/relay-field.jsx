'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['0,245,255', '0,245,255', '0,245,255', '255,43,209', '0,255,157']

// The hero's living backdrop: a drifting mesh of nodes, with bright packets
// hopping edge to edge — Relay, drawn. The pointer bends the mesh toward it
// and lights up nearby links. Pauses offscreen and in background tabs; with
// reduced motion it renders a single still frame.
export default function RelayField({ style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let dpr = 1
    let nodes = []
    let packets = []
    let raf = 0
    let running = false
    let visible = true
    const mouse = { x: -9999, y: -9999, active: false }
    const LINK = 150

    const seed = () => {
      const count = Math.round(Math.min(90, Math.max(34, (w * h) / 15000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        ox: 0,
        oy: 0,
      }))
      packets = []
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (!running) draw(false)
    }

    const spawnPacket = () => {
      const a = nodes[(Math.random() * nodes.length) | 0]
      let best = null
      let bestD = Infinity
      for (const b of nodes) {
        if (b === a) continue
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < LINK && d < bestD && Math.random() > 0.3) {
          best = b
          bestD = d
        }
      }
      if (best) packets.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.018, hops: 2 + ((Math.random() * 4) | 0) })
    }

    const draw = (step) => {
      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        if (step) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < -20) n.x = w + 20
          if (n.x > w + 20) n.x = -20
          if (n.y < -20) n.y = h + 20
          if (n.y > h + 20) n.y = -20
        }
        // Pointer gravity: displaced draw position eases toward the cursor.
        let tx = 0
        let ty = 0
        if (mouse.active) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d = Math.hypot(dx, dy)
          if (d < 220) {
            const f = (1 - d / 220) * 26
            tx = (dx / (d || 1)) * f
            ty = (dy / (d || 1)) * f
          }
        }
        n.ox += (tx - n.ox) * 0.08
        n.oy += (ty - n.oy) * 0.08
      }

      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const ax = a.x + a.ox
        const ay = a.y + a.oy
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const bx = b.x + b.ox
          const by = b.y + b.oy
          const d = Math.hypot(ax - bx, ay - by)
          if (d > LINK) continue
          let alpha = (1 - d / LINK) * 0.16
          if (mouse.active) {
            const md = Math.hypot((ax + bx) / 2 - mouse.x, (ay + by) / 2 - mouse.y)
            if (md < 200) alpha += (1 - md / 200) * 0.35
          }
          ctx.strokeStyle = `rgba(0,245,255,${alpha})`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c},0.75)`
        ctx.beginPath()
        ctx.arc(n.x + n.ox, n.y + n.oy, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (step) {
        if (packets.length < Math.min(14, nodes.length / 4) && Math.random() < 0.08) spawnPacket()
        for (let k = packets.length - 1; k >= 0; k--) {
          const p = packets[k]
          p.t += p.speed
          if (p.t >= 1) {
            p.hops -= 1
            const from = p.b
            let next = null
            for (const c of nodes) {
              if (c === from || c === p.a) continue
              if (Math.hypot(c.x - from.x, c.y - from.y) < LINK && Math.random() > 0.5) {
                next = c
                break
              }
            }
            if (!next || p.hops <= 0) {
              packets.splice(k, 1)
              continue
            }
            p.a = from
            p.b = next
            p.t = 0
          }
        }
      }
      for (const p of packets) {
        const x = p.a.x + p.a.ox + (p.b.x + p.b.ox - p.a.x - p.a.ox) * p.t
        const y = p.a.y + p.a.oy + (p.b.y + p.b.oy - p.a.y - p.a.oy) * p.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 10)
        g.addColorStop(0, 'rgba(160,255,255,0.95)')
        g.addColorStop(1, 'rgba(0,245,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw(true)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduce || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = mouse.y > -40 && mouse.y < rect.height + 40
    }
    const onLeave = () => {
      mouse.active = false
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    const ro = new ResizeObserver(resize)
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
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%', ...style }} />
}
