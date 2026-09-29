'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Play, RotateCcw } from 'lucide-react'
import { PRODUCT_ACCENTS } from './data'
import { useExplorer } from './explorer'
import type { PublicProduct } from './types'
import s from './landing.module.css'

// Relay Playground — a client-side simulation of POST /api/resolve.
// Demo data: nothing is sent to /api/resolve from this page. Apps and actions
// come from the public catalog; the matching rule below is illustrative:
// EU-market products fail closed outside the EU, global products route anywhere.

const COUNTRIES = [
  { code: 'SE', eu: true },
  { code: 'DE', eu: true },
  { code: 'NL', eu: true },
  { code: 'US', eu: false },
] as const
type Country = (typeof COUNTRIES)[number]['code']

type Outcome = { kind: 'match'; clickId: string } | { kind: 'fail-closed'; reason: string }

function demoClickId(seed: string): string {
  // Demo data — deterministic fake click id so the same input gives the same trace.
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return `c_${(h >>> 0).toString(16).padStart(8, '0').slice(0, 8)}`
}

function resolveDemo(product: PublicProduct, action: string, country: Country): Outcome {
  const eu = COUNTRIES.find((c) => c.code === country)?.eu ?? false
  if (product.primaryMarket === 'EU' && !eu) {
    return { kind: 'fail-closed', reason: `no approved destination for ${product.name} in ${country}` }
  }
  return { kind: 'match', clickId: demoClickId(`${product.slug}:${action}:${country}`) }
}

const STAGE_MS = 190

export default function RelayPlayground({ products }: { products: PublicProduct[] }) {
  const { complete } = useExplorer()
  const [slug, setSlug] = useState(products[0]?.slug ?? '')
  const product = products.find((p) => p.slug === slug) ?? products[0]
  const actions = product?.actions.length ? product.actions : ['open']
  const [action, setAction] = useState(actions[0])
  const [country, setCountry] = useState<Country>('SE')
  const [stage, setStage] = useState(-1)
  const [runKey, setRunKey] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!actions.includes(action)) setAction(actions[0])
  }, [actions, action])

  const outcome = useMemo(() => (product ? resolveDemo(product, action, country) : null), [product, action, country])

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  useEffect(() => clear, [])

  const lines = useMemo(() => {
    if (!product || !outcome) return []
    return [
      { tag: 'POST', text: `/api/resolve  { "app": "${product.slug}", "action": "${action}", "country": "${country}" }` },
      { tag: 'PARSE', text: `intent = ${product.name} · ${action} · ${country}` },
      { tag: 'MATCH', text: outcome.kind === 'match' ? 'allowlisted destination found' : outcome.reason },
      outcome.kind === 'match'
        ? { tag: '200', text: `{ "click_id": "${outcome.clickId}", "fallback": false }` }
        : { tag: 'FAIL', text: 'fail-closed → no redirect issued' },
      outcome.kind === 'match'
        ? { tag: 'GO', text: `/go/${outcome.clickId} → ${new URL(product.url).hostname}` }
        : { tag: 'DONE', text: 'nothing happens. that is the feature.' },
    ]
  }, [product, action, country, outcome])

  const run = () => {
    clear()
    setRunKey((k) => k + 1)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setStage(lines.length - 1)
    } else {
      setStage(0)
      for (let i = 1; i < lines.length; i += 1) {
        timers.current.push(window.setTimeout(() => setStage(i), i * STAGE_MS))
      }
    }
    complete('route-intent')
  }

  // Changing an input resets the trace so it never shows stale results.
  useEffect(() => {
    clear()
    setStage(-1)
  }, [slug, action, country])

  if (!product) return null
  const accent = PRODUCT_ACCENTS[product.slug] ?? '#00f5ff'
  const finished = stage >= lines.length - 1

  return (
    <div className={s.playground} style={{ '--tile-accent': accent } as CSSProperties}>
      <div className={s.pgControls}>
        <div className={`${s.previewLabel} ${s.mono}`}>App</div>
        <div className={s.pgChips} role="radiogroup" aria-label="App">
          {products.map((p) => (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={p.slug === slug}
              className={`${s.pgChip} ${p.slug === slug ? s.pgChipOn : ''}`}
              style={{ '--chip': PRODUCT_ACCENTS[p.slug] ?? '#00f5ff' } as CSSProperties}
              onClick={() => setSlug(p.slug)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className={`${s.previewLabel} ${s.mono}`}>Action</div>
        <div className={s.pgChips} role="radiogroup" aria-label="Action">
          {actions.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={a === action}
              className={`${s.pgChip} ${s.mono} ${a === action ? s.pgChipOn : ''}`}
              onClick={() => setAction(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <div className={`${s.previewLabel} ${s.mono}`}>Country</div>
        <div className={s.pgChips} role="radiogroup" aria-label="Country">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              role="radio"
              aria-checked={c.code === country}
              className={`${s.pgChip} ${s.mono} ${c.code === country ? s.pgChipOn : ''}`}
              onClick={() => setCountry(c.code)}
            >
              {c.code}
            </button>
          ))}
        </div>
        <button type="button" className={s.btnPrimary} onClick={run} style={{ marginTop: 6 }}>
          {stage >= 0 ? <RotateCcw size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {stage >= 0 ? 'Resolve again' : 'Resolve intent'}
        </button>
      </div>

      <div className={s.terminal}>
        <div className={s.termBar}>
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={`${s.termTitle} ${s.mono}`}>RELAY · SIMULATION · DEMO DATA</span>
        </div>
        <ol className={`${s.pgTrace} ${s.mono}`} aria-live="polite" key={runKey}>
          {stage < 0 && <li className={s.pgIdle}>Pick an app, action and country — then resolve.</li>}
          {lines.map((line, i) =>
            i <= stage ? (
              <li key={line.tag} className={s.pgLine}>
                <span
                  className={
                    line.tag === 'FAIL' || line.tag === 'DONE'
                      ? s.scanFail
                      : line.tag === '200' || line.tag === 'GO'
                        ? s.scanPass
                        : s.logTag
                  }
                >
                  {line.tag}
                </span>
                <span>{line.text}</span>
              </li>
            ) : null,
          )}
        </ol>
        {finished && (
          <div className={s.pgResult}>
            {outcome?.kind === 'match' ? (
              <>
                <span>Routed. In production this is where the visitor lands:</span>
                <a href={product.url} target="_blank" rel="noreferrer" className={s.tileLink}>
                  Open {product.name} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </>
            ) : (
              <span>Fail-closed: no approved answer, so no redirect. Try an EU country.</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
