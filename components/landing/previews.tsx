'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from './clipboard'
import { useExplorer } from './explorer'
import s from './landing.module.css'

// Every preview in this file is self-contained and client-side only.
// Nothing here calls a real API; all values are hardcoded demo data.

type Notify = (message: string) => void

function useCopy(notify: Notify) {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string, label: string) => {
    const ok = await copyText(text)
    notify(ok ? `Copied ${label}` : 'Copy failed — select the text manually')
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    }
  }
  return { copied, copy }
}

export function CopyButton({
  text,
  label,
  notify,
  onCopied,
}: {
  text: string
  label: string
  notify: Notify
  onCopied?: () => void
}) {
  const { copied, copy } = useCopy(notify)
  return (
    <button
      type="button"
      className={s.copyBtn}
      onClick={() => {
        void copy(text, label)
        onCopied?.()
      }}
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ------------------------------ StayTag ------------------------------- */

// Demo data — a decorative QR-like grid (not a scannable code).
const QR_SIZE = 21
function demoQrCells(): boolean[] {
  const cells: boolean[] = []
  let seed = 7
  const finder = (x: number, y: number, ox: number, oy: number) => {
    const dx = x - ox
    const dy = y - oy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
    return edge || core
  }
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      const f = finder(x, y, 0, 0) ?? finder(x, y, QR_SIZE - 7, 0) ?? finder(x, y, 0, QR_SIZE - 7)
      if (f !== null) {
        cells.push(f)
        continue
      }
      seed = (seed * 75 + 74) % 65537
      cells.push(seed % 3 === 0)
    }
  }
  return cells
}

// Demo data — mirrors the README "Test routing" example payload.
const DEMO_LABEL = {
  product: 'Brita Maxtra Pro',
  category: 'water-filter',
  country: 'SE',
  query: 'Brita Maxtra Pro',
}

export function StayTagPreview() {
  const cells = useMemo(demoQrCells, [])
  const [scanned, setScanned] = useState(false)
  const { complete } = useExplorer()

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={s.label}>
        <svg className={s.qr} viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} role="img" aria-label="Illustrative reorder label code">
          {cells.map((on, i) =>
            on ? <rect key={i} x={i % QR_SIZE} y={Math.floor(i / QR_SIZE)} width="1" height="1" fill="#05050b" /> : null,
          )}
        </svg>
        <div>
          <div className={s.previewLabel + ' ' + s.mono}>Reorder label</div>
          <div className={s.labelTitle}>{DEMO_LABEL.product}</div>
          <div className={s.labelMeta}>
            {DEMO_LABEL.category} · {DEMO_LABEL.country} · no app, no account
          </div>
        </div>
      </div>
      <div className={s.scanRow}>
        <button
          type="button"
          className={s.miniBtn}
          onClick={() => {
            setScanned((v) => !v)
            complete('scan-label')
          }}
          aria-pressed={scanned}
        >
          {scanned ? 'Reset' : 'Simulate a scan'}
        </button>
      </div>
      <div aria-live="polite">
        {scanned && (
          <div className={`${s.resultLine} ${s.mono}`}>
            → reorder search for <strong>{DEMO_LABEL.query}</strong>
            <br />
            action=reorder · country={DEMO_LABEL.country} · fail-closed if no approved partner
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Vatidence ----------------------------- */

type VatOutcome =
  | { state: 'valid'; name: string; consultation: string }
  | { state: 'invalid'; reason: string }
  | { state: 'format'; reason: string }
  | { state: 'unknown' }

// Demo data — hardcoded outcomes. Nothing is sent to VIES from this page.
const DEMO_VAT: Record<string, VatOutcome> = {
  DE123456789: { state: 'valid', name: 'Demo Handels GmbH', consultation: 'DEMO-7Q2K-19XF' },
  IT00000000000: { state: 'invalid', reason: 'Not active for intra-EU trade' },
}
const DEMO_VAT_KEYS = Object.keys(DEMO_VAT)
const VAT_FORMAT = /^[A-Z]{2}[0-9A-Z]{2,12}$/

function checkDemoVat(raw: string): VatOutcome {
  const v = raw.replace(/[\s.-]/g, '').toUpperCase()
  if (!VAT_FORMAT.test(v)) return { state: 'format', reason: 'Expected a country prefix + number, e.g. DE123456789' }
  return DEMO_VAT[v] ?? { state: 'unknown' }
}

export function VatidencePreview({ productUrl }: { productUrl: string }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<VatOutcome | null>(null)
  const { complete } = useExplorer()

  const check = (v: string) => {
    const outcome = checkDemoVat(v)
    setResult(outcome)
    if (outcome.state === 'valid' || outcome.state === 'invalid') complete('check-vat')
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    check(value)
  }
  const tryValue = (v: string) => {
    setValue(v)
    check(v)
  }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <label htmlFor="demo-vat" className={`${s.previewLabel} ${s.mono}`}>
        EU VAT number
      </label>
      <form className={s.vatForm} onSubmit={submit}>
        <input
          id="demo-vat"
          className={s.vatInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. DE123456789"
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
        />
        <button type="submit" className={s.miniBtn}>
          Check
        </button>
      </form>
      <div className={s.chips}>
        {DEMO_VAT_KEYS.map((k) => (
          <button key={k} type="button" className={s.chip} onClick={() => tryValue(k)}>
            {k}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {result?.state === 'valid' && (
          <div className={`${s.vatResult} ${s.vatValid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✓ VALID</span>
            <span>{result.name}</span>
            <span className={s.mono}>Consultation no. {result.consultation}</span>
          </div>
        )}
        {result?.state === 'invalid' && (
          <div className={`${s.vatResult} ${s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✕ INVALID</span>
            <span>{result.reason}</span>
          </div>
        )}
        {result?.state === 'format' && (
          <div className={`${s.vatResult} ${s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>FORMAT</span>
            <span>{result.reason}</span>
          </div>
        )}
        {result?.state === 'unknown' && (
          <div className={s.vatResult}>
            <span>
              Not in the demo set. Run a real check on{' '}
              <a href={productUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--tile-accent)' }}>
                Vatidence
              </a>
              .
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------- Nytto Checkout --------------------------- */

// Demo data — illustrative flow steps based on the product description.
const CURL_FLOW = [
  { title: 'Upload a file', detail: 'report.pdf · 2.4 MB' },
  { title: 'Set a price', detail: '49 SEK · 5% fee only when it sells' },
  { title: 'Share the link', detail: 'Buyer pays by card, no account' },
  { title: 'Time-limited download', detail: 'Link expires after 24h' },
]

export function NyttoCheckoutPreview({ productUrl, notify }: { productUrl: string; notify: Notify }) {
  const [step, setStep] = useState(0)
  const { complete } = useExplorer()
  // Static snippet: a HEAD request to the product's existing public URL.
  const snippet = `curl -sI ${productUrl}`

  return (
    <div className={s.curlGrid}>
      <div className={s.terminal}>
        <div className={s.termBar}>
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={s.termDot} />
          <span className={`${s.termTitle} ${s.mono}`}>TERMINAL</span>
          <CopyButton text={snippet} label="curl snippet" notify={notify} onCopied={() => complete('curl-flow')} />
        </div>
        <pre className={s.code}>
          <span className={s.codePrompt}>$ </span>
          {snippet}
          {'\n'}
          <span className={s.codeComment}># Demo data — illustrative, not live output</span>
          {'\n'}
          <span className={s.codeComment}># step {step + 1}/4: </span>
          <span className={s.codeOk}>{CURL_FLOW[step].title.toLowerCase()}</span>
          {'\n'}
          <span className={s.codeComment}>#   </span>
          {CURL_FLOW[step].detail}
        </pre>
      </div>
      <ol className={s.flow} aria-label="How a sale works (demo)">
        {CURL_FLOW.map((f, i) => (
          <li key={f.title}>
            <button
              type="button"
              className={`${s.flowStep} ${i === step ? s.flowStepOn : ''}`}
              onClick={() => {
                setStep(i)
                if (i === CURL_FLOW.length - 1) complete('curl-flow')
              }}
              aria-pressed={i === step}
              style={{ width: '100%' }}
            >
              <span className={`${s.flowNum} ${s.mono}`}>0{i + 1}</span>
              <span>{f.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------------------------- DeployDoctor ---------------------------- */

type ScanState = 'pass' | 'fail' | 'warn'

// Demo data — check names come from deploydoctor.nyttolabs.com; the repo and
// every result below are illustrative. Nothing is scanned from this page.
const DEMO_REPO = 'github.com/example/shop'
const DEMO_SCAN: { check: string; state: ScanState; note: string }[] = [
  { check: 'Next.js entrypoint', state: 'pass', note: 'app/ router detected' },
  { check: 'Broken imports', state: 'fail', note: 'case mismatch: ./Components/Header' },
  { check: 'Vercel-incompatible server code', state: 'pass', note: 'no long-running server found' },
  { check: 'Environment variables', state: 'warn', note: 'DATABASE_URL used but not documented' },
]

const SCAN_ICON: Record<ScanState, string> = { pass: '✓', fail: '✕', warn: '!' }

export function DeployDoctorPreview() {
  const [scanned, setScanned] = useState(false)
  const { complete } = useExplorer()
  const iconClass: Record<ScanState, string> = { pass: s.scanPass, fail: s.scanFail, warn: s.scanWarn }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={`${s.previewLabel} ${s.mono}`}>Public GitHub repository</div>
      <div className={s.vatForm}>
        <span className={`${s.scanRepo} ${s.mono}`}>{DEMO_REPO}</span>
        <button
          type="button"
          className={s.miniBtn}
          onClick={() => {
            setScanned((v) => !v)
            complete('deploy-scan')
          }}
          aria-pressed={scanned}
        >
          {scanned ? 'Reset' : 'Run demo scan'}
        </button>
      </div>
      <div aria-live="polite">
        {scanned && (
          <ul className={s.scanList}>
            {DEMO_SCAN.map((row) => (
              <li key={row.check} className={s.scanItem}>
                <span className={`${iconClass[row.state]} ${s.mono}`} aria-hidden="true">
                  {SCAN_ICON[row.state]}
                </span>
                <span>
                  <strong>{row.check}</strong> <span className={s.srOnly}>({row.state})</span>
                  <br />
                  <span className={s.mono}>{row.note}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ----------------------------- Failclosed ----------------------------- */

// Demo data — two illustrative sync runs between a warehouse and a shop.
// Nothing here talks to a real system.
type SyncScenario = 'drift' | 'empty'
const SYNC_SCENARIOS: { id: SyncScenario; label: string; warehouse: number | null; shop: number }[] = [
  { id: 'drift', label: 'Warehouse 40 · Shop 12', warehouse: 40, shop: 12 },
  { id: 'empty', label: 'Empty warehouse response', warehouse: null, shop: 12 },
]

export function FailclosedPreview() {
  const [scenario, setScenario] = useState<SyncScenario>('drift')
  const [ran, setRan] = useState(false)
  const { complete } = useExplorer()
  const current = SYNC_SCENARIOS.find((sc) => sc.id === scenario) ?? SYNC_SCENARIOS[0]
  const repaired = ran && current.warehouse !== null
  const refused = ran && current.warehouse === null

  const pick = (id: SyncScenario) => {
    setScenario(id)
    setRan(false)
  }
  const run = () => {
    setRan(true)
    if (current.warehouse === null) complete('failclosed-refuse')
  }

  return (
    <div className={s.preview}>
      <span className={`${s.demoTag} ${s.mono}`}>DEMO</span>
      <div className={`${s.previewLabel} ${s.mono}`}>Daily sync · pick a case</div>
      <div className={s.chips} role="radiogroup" aria-label="Sync case">
        {SYNC_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            type="button"
            role="radio"
            aria-checked={sc.id === scenario}
            className={`${s.pgChip} ${s.mono} ${sc.id === scenario ? s.pgChipOn : ''}`}
            onClick={() => pick(sc.id)}
          >
            {sc.label}
          </button>
        ))}
      </div>
      <div className={`${s.syncTable} ${s.mono}`}>
        <span className={s.syncHead}>Warehouse</span>
        <span className={s.syncHead}>Shop</span>
        <span>{current.warehouse === null ? '— (no rows)' : current.warehouse}</span>
        <span>
          {repaired ? (
            <>
              <s className={s.syncOld}>{current.shop}</s> → <strong>{current.warehouse}</strong>
            </>
          ) : (
            current.shop
          )}
        </span>
      </div>
      <div className={s.scanRow}>
        <button type="button" className={s.miniBtn} onClick={run}>
          Run sync
        </button>
      </div>
      <div aria-live="polite">
        {repaired && (
          <div className={`${s.vatResult} ${s.vatValid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✓ Repaired</span>
            <span>Shop set to {current.warehouse} to match the warehouse.</span>
          </div>
        )}
        {refused && (
          <div className={`${s.vatResult} ${s.vatInvalid}`}>
            <span className={`${s.vatBadge} ${s.mono}`}>✕ Refused · source_empty</span>
            <span>The warehouse returned no rows, so nothing was written.</span>
          </div>
        )}
      </div>
    </div>
  )
}
