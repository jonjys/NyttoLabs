'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// ── WebGL shader strings ──────────────────────────────────────────────────────

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform float T;
uniform vec2 M, R;

vec3 m3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 m4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 pm(vec4 x) { return m4(((x * 34.0) + 1.0) * x); }
vec4 ti(vec4 r) { return 1.7928429 - 0.8537347 * r; }

float sn(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = m3(i);
  vec4 p = pm(pm(pm(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 xx = x_ * ns.x + ns.yyyy;
  vec4 yy = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(xx) - abs(yy);
  vec4 b0 = vec4(xx.xy, yy.xy);
  vec4 b1 = vec4(xx.zw, yy.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy,  h.x);
  vec3 p1 = vec3(a0.zw,  h.y);
  vec3 p2 = vec3(a1.xy,  h.z);
  vec3 p3 = vec3(a1.zw,  h.w);
  vec4 norm = ti(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / R;
  vec2 ms = M / R;
  float t  = T * 0.18;
  float n1 = sn(vec3(uv * 2.2 + ms * 0.5, t));
  float n2 = sn(vec3(uv * 4.5 - ms * 0.25, t + 1.7)) * 0.5;
  float n3 = sn(vec3(uv * 9.0, t * 1.4)) * 0.18;
  float n  = n1 + n2 + n3;
  vec3 base = vec3(0.01, 0.01, 0.055);
  vec3 c = base
    + vec3(0.0, 0.96, 1.0)  * max(0.0,  n       ) * 0.17
    + vec3(1.0, 0.0,  0.67) * max(0.0, -n * 0.7  ) * 0.11
    + vec3(0.54,0.36, 1.0)  * abs(n2)               * 0.09;
  float vig = 1.0 - dot(uv - 0.5, (uv - 0.5) * 2.5);
  c *= max(0.0, vig);
  gl_FragColor = vec4(c, 1.0);
}
`

// ── Shader canvas ─────────────────────────────────────────────────────────────

function ShaderBg({ mouseRef }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const gl = c.getContext('webgl')
    if (!gl) return

    const mk = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const pr = gl.createProgram()
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT))
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(pr)
    gl.useProgram(pr)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uT = gl.getUniformLocation(pr, 'T')
    const uM = gl.getUniformLocation(pr, 'M')
    const uR = gl.getUniformLocation(pr, 'R')

    const resize = () => {
      c.width  = window.innerWidth
      c.height = window.innerHeight
      gl.viewport(0, 0, c.width, c.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf
    const tick = (ts) => {
      gl.uniform1f(uT, ts * 0.001)
      gl.uniform2f(uM, mouseRef.current.x, c.height - mouseRef.current.y)
      gl.uniform2f(uR, c.width, c.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [mouseRef])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -20 }}
    />
  )
}

// ── Particle field ────────────────────────────────────────────────────────────

function ParticleField({ mouseRef }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let W = c.width = window.innerWidth
    let H = c.height = window.innerHeight

    const COLS = ['#00f5ff', '#ff00aa', '#8b5cf6']
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.6 + 0.4,
      op: Math.random() * 0.35 + 0.1,
      col: COLS[Math.floor(Math.random() * 3)],
    }))

    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 140 && d > 0) {
          const f = (140 - d) / 140 * 0.5
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx *= 0.97; p.vy *= 0.97
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col
        ctx.globalAlpha = p.op
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [mouseRef])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -10 }}
    />
  )
}

// ── Custom cursor ─────────────────────────────────────────────────────────────

function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos   = useRef({ x: -200, y: -200 })
  const rpos  = useRef({ x: -200, y: -200 })
  const hov   = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`
    }
    document.addEventListener('mousemove', onMove)

    const enter = () => { hov.current = true }
    const leave = () => { hov.current = false }
    const addHover = (el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    }
    document.querySelectorAll('a, button').forEach(addHover)

    const lerp = (a, b, n) => a + (b - a) * n
    let raf
    const anim = () => {
      rpos.current.x = lerp(rpos.current.x, pos.current.x, 0.1)
      rpos.current.y = lerp(rpos.current.y, pos.current.y, 0.1)
      if (ringRef.current) {
        const s = hov.current ? 2.8 : 1
        ringRef.current.style.transform =
          `translate(${rpos.current.x - 18}px, ${rpos.current.y - 18}px) scale(${s})`
        ringRef.current.style.borderColor = hov.current
          ? 'rgba(0,245,255,0.9)' : 'rgba(0,245,255,0.5)'
      }
      raf = requestAnimationFrame(anim)
    }
    raf = requestAnimationFrame(anim)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none mix-blend-screen"
        style={{ zIndex: 9999, width: 6, height: 6, borderRadius: '50%', background: '#00f5ff' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none mix-blend-screen"
        style={{
          zIndex: 9998,
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(0,245,255,0.5)',
          transition: 'transform 0.1s ease-out, border-color 0.15s',
        }}
      />
    </>
  )
}

// ── 3D tilt card ──────────────────────────────────────────────────────────────

function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const [tilt, setTilt]   = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [hov, setHov]     = useState(false)

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    setTilt({ x: y * -16, y: x * 16 })
    setGlare({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 })
  }
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setHov(false) }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
        ...style,
      }}
    >
      {hov && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 10,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.1) 0%, transparent 65%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}

// ── Marquee ───────────────────────────────────────────────────────────────────

const MARQUEE = 'NYTTO LABS · NYTTOLABS.COM · STOCKHOLM, SWEDEN · TOOLS THAT WORK · '

function Marquee() {
  const items = Array(10).fill(MARQUEE)
  return (
    <div className="overflow-hidden border-y py-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}>
      <motion.div
        className="flex whitespace-nowrap text-[10px] font-mono tracking-[0.28em]"
        style={{ color: 'rgba(255,255,255,0.2)' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i}>
            {t}
            <span style={{ color: 'rgba(0,245,255,0.4)' }}> · </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/products', label: 'Products' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact',  label: 'Contact'  },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,16,0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: '#00f5ff', boxShadow: '0 0 16px rgba(0,245,255,0.5)' }}
          >
            <span className="block h-3 w-3 rounded-full" style={{ background: '#050510' }} />
          </span>
          <span className="text-sm font-semibold tracking-[0.18em] text-white">NYTTO LABS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
            style={{
              border: '1px solid rgba(0,245,255,0.35)',
              color: '#00f5ff',
            }}
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

const ROTATING_WORDS = ['tools', 'software', 'products', 'systems']

function Hero() {
  const [wi, setWi] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWi((i) => (i + 1) % ROTATING_WORDS.length), 2400)
    return () => clearInterval(id)
  }, [])

  const chars = 'NYTTO LABS'.split('')

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-8 flex gap-3"
      >
        <span
          className="rounded-full px-3 py-1 text-xs backdrop-blur-sm"
          style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.04)' }}
        >
          Stockholm, Sweden
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs backdrop-blur-sm"
          style={{ border: '1px solid rgba(0,245,255,0.25)', color: 'rgba(0,245,255,0.7)', background: 'rgba(0,245,255,0.05)' }}
        >
          Est. 2024
        </span>
      </motion.div>

      {/* Kinetic title */}
      <h1
        className="font-black tracking-tighter text-white"
        style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)', lineHeight: 0.88 }}
      >
        <div style={{ overflow: 'hidden' }}>
          {chars.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: '120%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.045, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </div>
      </h1>

      {/* Rotating tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-8 text-lg font-light tracking-wide"
        style={{ color: 'rgba(255,255,255,0.38)' }}
      >
        We build&nbsp;
        <AnimatePresence mode="wait">
          <motion.span
            key={wi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#00f5ff', fontWeight: 500 }}
          >
            {ROTATING_WORDS[wi]}
          </motion.span>
        </AnimatePresence>
        &nbsp;that actually work.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <motion.div
          animate={{ boxShadow: ['0 0 22px rgba(0,245,255,0.22)', '0 0 45px rgba(0,245,255,0.45)', '0 0 22px rgba(0,245,255,0.22)'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-bold transition-colors"
            style={{ background: '#00f5ff', color: '#050510' }}
          >
            See what we build
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium transition-colors duration-200 hover:text-white"
          style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
        >
          Partner with us
        </Link>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.2)' }}>SCROLL</span>
        <motion.div
          className="w-px"
          style={{ height: 32, background: 'linear-gradient(to bottom, rgba(0,245,255,0.4), transparent)' }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

const STATS = [
  { n: '2',    label: 'Live products'    },
  { n: '2+',   label: 'In beta'          },
  { n: '100%', label: 'Self-funded'      },
  { n: 'SWE',  label: 'Headquartered'    },
]

function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y  = useTransform(scrollYProgress, [0, 1], [60, -60])
  const op = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-32">
      <motion.div style={{ y, opacity: op }}>
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <p className="mb-4 text-[10px] font-mono tracking-[0.35em]" style={{ color: 'rgba(0,245,255,0.55)' }}>
              ABOUT
            </p>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-white">
              A Swedish software company that builds tools people actually use.
            </h2>
            <p className="mb-5 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              We don't build platforms. We build precise, self-contained tools — each with its own name, its own site, and its own job to do.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Every product starts with a specific problem and stops when that problem is solved. No feature bloat. No ecosystem lock-in. Just software that works.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-xl p-6 backdrop-blur-sm"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="mb-1 text-3xl font-black text-white">{s.n}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.33)' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── Services (placeholder for products) ──────────────────────────────────────

const CATEGORIES = [
  {
    icon: '◆',
    color: '#00f5ff',
    title: 'Digital tools',
    desc: 'Focused utilities built around a single, well-defined problem. No accounts required to get started.',
  },
  {
    icon: '⬡',
    color: '#ff00aa',
    title: 'B2B software',
    desc: 'Tools aimed at businesses that need reliable, auditable workflows. Exportable. Integrable. Simple.',
  },
  {
    icon: '◉',
    color: '#8b5cf6',
    title: 'Developer utilities',
    desc: 'Lightweight pieces that solve the boring parts so you can focus on the interesting ones.',
  },
]

function Services() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-4 text-[10px] font-mono tracking-[0.35em]" style={{ color: 'rgba(0,245,255,0.55)' }}>
          WHAT WE BUILD
        </p>
        <h2 className="text-4xl font-bold text-white">Three categories. Zero fluff.</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <TiltCard
              className="h-full rounded-2xl p-8 backdrop-blur-sm"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}
            >
              <div
                className="mb-6 text-3xl"
                style={{ color: cat.color, filter: `drop-shadow(0 0 14px ${cat.color}80)` }}
              >
                {cat.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{cat.title}</h3>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {cat.desc}
              </p>
              <Link
                href="/products"
                className="text-[10px] font-mono tracking-[0.2em] transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                VIEW PRODUCTS →
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-12 text-center"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(0,245,255,0.05) 0%, rgba(139,92,246,0.05) 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,245,255,0.12) 0%, transparent 65%)' }}
        />
        <div className="relative">
          <p className="mb-4 text-[10px] font-mono tracking-[0.35em]" style={{ color: 'rgba(0,245,255,0.55)' }}>
            GET IN TOUCH
          </p>
          <h2 className="mb-4 text-4xl font-bold text-white">Let's work together.</h2>
          <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Partnerships, integrations, or just a conversation about what we're building.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              animate={{ boxShadow: ['0 0 22px rgba(0,245,255,0.18)', '0 0 44px rgba(0,245,255,0.38)', '0 0 22px rgba(0,245,255,0.18)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-bold transition-colors"
                style={{ background: '#00f5ff', color: '#050510' }}
              >
                Become a partner
              </Link>
            </motion.div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium transition-colors duration-200 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
            >
              Send us a note
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="px-6 py-10"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        style={{ color: 'rgba(255,255,255,0.2)' }}>
        <span className="font-mono tracking-[0.22em]">NYTTO LABS</span>
        <div className="flex flex-wrap justify-center gap-6">
          {[['Home', '/'], ['Products', '/products'], ['Partners', '/partners'], ['Contact', '/contact'], ['Privacy', '/privacy']].map(([l, h]) => (
            <Link key={h} href={h} className="transition-colors duration-200 hover:text-white">{l}</Link>
          ))}
        </div>
        <span>© {new Date().getFullYear()} Nytto Labs</span>
      </div>
    </footer>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function HomeView() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const h = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])

  return (
    <div className="min-h-screen text-white" style={{ background: '#050510', cursor: 'none' }}>
      <ShaderBg mouseRef={mouseRef} />
      <ParticleField mouseRef={mouseRef} />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
