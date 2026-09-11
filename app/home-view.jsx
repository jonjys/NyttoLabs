'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { PORTALS } from '@/components/lobby/portals'

const PortalScene = dynamic(() => import('@/components/lobby/portal-scene'), {
  ssr: false,
  loading: () => null,
})

// ── Reticle cursor ───────────────────────────────────────────────────────────

function Reticle() {
  const dot = useRef(null)
  const ring = useRef(null)
  const pos = useRef({ x: -200, y: -200 })
  const rpos = useRef({ x: -200, y: -200 })

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.16
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.16
      if (ring.current) {
        ring.current.style.transform = `translate(${rpos.current.x - 16}px, ${rpos.current.y - 16}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 mix-blend-screen"
        style={{ zIndex: 9999, width: 4, height: 4, borderRadius: '50%', background: '#00f5ff' }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 mix-blend-screen"
        style={{
          zIndex: 9998,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(0,245,255,0.45)',
        }}
      />
    </>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function HomeView() {
  const [target, setTarget] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [flash, setFlash] = useState(null)

  const select = useCallback(
    (i) => {
      setTarget((cur) => {
        if (cur !== null) return cur
        setTransitioning(true)
        setFlash(PORTALS[i].color)
        return i
      })
    },
    [],
  )

  const back = useCallback(() => {
    setTransitioning(true)
    setFlash('#00f5ff')
    setTarget(null)
  }, [])

  const onArrive = useCallback(() => {
    setTransitioning(false)
    setFlash(null)
  }, [])

  // Esc returns to the lobby
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && target !== null && !transitioning) back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [target, transitioning, back])

  // Touch devices have no cursor to replace and no hover to hint at.
  const [finePointer, setFinePointer] = useState(false)
  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)')?.matches ?? true
    setFinePointer(fine)
    if (!fine) return undefined
    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  const room = target === null ? null : PORTALS[target]
  const inLobby = target === null && !transitioning
  const inRoom = target !== null && !transitioning

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: '#03030c' }}>
      {/* 3D world */}
      <div className="absolute inset-0">
        <PortalScene
          target={target}
          transitioning={transitioning}
          onSelect={select}
          onArrive={onArrive}
        />
      </div>

      {finePointer && <Reticle />}

      {/* Portal-transit flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 50 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.3, times: [0, 0.5, 1], ease: 'easeInOut' }}
          >
            <div
              className="h-full w-full"
              style={{ background: `radial-gradient(circle at 50% 42%, ${flash} 0%, transparent 70%)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline / vignette grade */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 30,
          background:
            'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0" style={{ zIndex: 40 }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="pointer-events-auto flex items-center gap-2.5"
            onClick={(e) => {
              if (target !== null) {
                e.preventDefault()
                back()
              }
            }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: '#00f5ff', boxShadow: '0 0 14px rgba(0,245,255,0.6)' }}
            >
              <span className="block h-2 w-2 rounded-full" style={{ background: '#03030c' }} />
            </span>
            <span className="font-mono text-xs tracking-[0.3em] text-white">NYTTO LABS</span>
          </Link>
          <span
            className="font-mono text-[9px] tracking-[0.28em]"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            STOCKHOLM · EST. 2024
          </span>
        </div>
      </header>

      {/* Lobby HUD */}
      <AnimatePresence>
        {inLobby && (
          <motion.div
            key="lobby"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-5 pb-8 sm:pb-14"
            style={{ zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="mb-3 text-center font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(1.9rem, 9vw, 4.4rem)', lineHeight: 0.92 }}
              initial={{ y: 26, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {'NYTTO LABS'.split('').map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {c === ' ' ? ' ' : c}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="mb-6 max-w-md text-center text-[13px] font-light leading-relaxed sm:text-sm"
              style={{ color: 'rgba(255,255,255,0.42)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              A Swedish software company. Three doors, three rooms — pick one and walk through.
            </motion.p>

            <motion.div
              className="flex max-w-full items-center gap-2.5 rounded-full px-4 py-2 backdrop-blur-sm sm:gap-3 sm:px-5"
              style={{
                border: '1px solid rgba(0,245,255,0.2)',
                background: 'rgba(0,245,255,0.05)',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            >
              <motion.span
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: '#00f5ff' }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="font-mono text-[8px] tracking-[0.16em] sm:text-[9px] sm:tracking-[0.26em]"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {finePointer
                  ? 'MOVE MOUSE TO LOOK · CLICK A PORTAL TO ENTER'
                  : 'DRAG TO LOOK · TAP A PORTAL TO ENTER'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room HUD */}
      <AnimatePresence>
        {inRoom && room && (
          <motion.div
            key={room.id}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-4 pb-8 sm:pb-16"
            style={{ zIndex: 40 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl p-6 text-center backdrop-blur-md sm:p-8"
              style={{
                border: `1px solid ${room.color}38`,
                background: 'rgba(3,3,12,0.62)',
                boxShadow: `0 0 60px ${room.color}1f`,
              }}
            >
              <p
                className="mb-3 font-mono text-[9px] tracking-[0.34em]"
                style={{ color: room.color }}
              >
                {room.label} ROOM
              </p>
              <h2 className="mb-3 text-2xl font-bold leading-tight text-white sm:mb-4 sm:text-3xl">
                {room.heading}
              </h2>
              <p
                className="mb-6 text-[13px] leading-relaxed sm:mb-8 sm:text-sm"
                style={{ color: 'rgba(255,255,255,0.46)' }}
              >
                {room.blurb}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={room.href}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg px-6 py-3 text-sm font-bold transition-transform hover:scale-105 sm:flex-none"
                  style={{ background: room.color, color: '#03030c' }}
                >
                  {room.cta} →
                </Link>
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors hover:text-white sm:flex-none"
                  style={{
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  ← Back to lobby
                </button>
              </div>

              {finePointer && (
                <p
                  className="mt-5 font-mono text-[8px] tracking-[0.24em]"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  PRESS ESC TO RETURN
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-transit caption */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-16 text-center"
            style={{ zIndex: 45 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.4em]"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {target === null ? 'RETURNING TO LOBBY' : `ENTERING ${PORTALS[target].label}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
