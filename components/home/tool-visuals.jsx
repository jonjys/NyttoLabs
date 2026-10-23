// A small drawing of what each tool does, shown at the top of its card.
// Decorative only (aria-hidden): the card text says the same in words.

const WORDS = {
  en: {
    ready: 'Ready', valid: 'Valid', fix: '1 fix',
    checks: ['next.config.js', 'Environment variables', 'Edge runtime imports'],
    box: 'Box 14', room: 'Kitchen', items: 'Plates, mugs, kettle',
    file: 'Nordic presets', download: 'Instant download', pay: 'Pay',
    cols: ['sku', 'name'], csvFoot: 'UTF-8 · ; → , · zeros kept',
    shop: 'Shop', warehouse: 'Warehouse', inStock: 'in stock', fixed: '1 fixed', held: '1 held',
    policy: 'AI policy', done: 'Ready', parts: ['Policy', 'Fraud', 'Workflows'],
    yours: 'Your product',
  },
  sv: {
    ready: 'Redo', valid: 'Giltigt', fix: '1 fix',
    checks: ['next.config.js', 'Miljövariabler', 'Edge runtime-importer'],
    box: 'Låda 14', room: 'Kök', items: 'Tallrikar, muggar, vattenkokare',
    file: 'Nordiska presets', download: 'Direkt nedladdning', pay: 'Betala',
    cols: ['sku', 'namn'], csvFoot: 'UTF-8 · ; → , · nollor kvar',
    shop: 'Butik', warehouse: 'Lager', inStock: 'i lager', fixed: '1 lagad', held: '1 stoppad',
    policy: 'AI‑policy', done: 'Klar', parts: ['Policy', 'Bedrägeri', 'Flöden'],
    yours: 'Din produkt',
  },
}

const chip = 'rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em]'
const ok = `${chip} bg-[rgba(15,122,69,0.1)] text-live`
const panel = 'rounded-2xl bg-surface shadow-[0_0_0_1px_var(--nl-line),0_12px_28px_-16px_rgba(12,12,14,0.3)]'

function DeployDoctor({ w }) {
  const rows = [
    [w.checks[0], 'ok'],
    [w.checks[1], 'ok'],
    [w.checks[2], 'fix'],
  ]
  return (
    <div className={`${panel} w-[min(22rem,88%)] p-3.5 text-left`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-faded">github.com/acme/web</span>
        <span className={ok}>{w.ready}</span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {rows.map(([label, state]) => (
          <li key={label} className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-1.5 text-[12.5px]">
            <span className="text-ink-2">{label}</span>
            <span className={state === 'ok' ? 'text-live' : 'text-iris'}>{state === 'ok' ? '✓' : w.fix}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Vatidence({ w }) {
  return (
    <div className={`${panel} w-[min(15rem,84%)] p-4 text-left`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faded">VIES · EU</p>
      <p className="mt-1.5 font-mono text-[15px] font-medium tracking-wide text-ink">DE130745279</p>
      <div className="mt-3 flex items-center justify-between">
        <span className={ok}>{w.valid}</span>
        <span className="font-mono text-[10px] text-faded">PDF · CSV</span>
      </div>
    </div>
  )
}

// A fixed QR-like pattern; it is a drawing, not a scannable code.
const QR = [
  '1110101', '1010011', '1110110', '0001010', '1101011', '0110101', '1011101',
]
function StayTag({ w }) {
  return (
    <div className={`${panel} flex w-[min(15rem,86%)] items-center gap-3 p-3 text-left`}>
      <div className="grid shrink-0 grid-cols-7 gap-[2px] rounded-md bg-surface p-1.5 shadow-[0_0_0_1px_var(--nl-line)]">
        {QR.join('').split('').map((c, i) => (
          <span key={i} className={`h-[7px] w-[7px] rounded-[1.5px] ${c === '1' ? 'bg-ink' : 'bg-transparent'}`} />
        ))}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faded">{w.box}</p>
        <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-ink">{w.room}</p>
        <p className="mt-0.5 truncate text-[11.5px] text-faded">{w.items}</p>
      </div>
    </div>
  )
}

function Checkout({ w }) {
  return (
    <div className={`${panel} w-[min(14rem,84%)] p-3.5 text-left`}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas-2 font-mono text-[9px] font-medium text-ink-2">ZIP</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">{w.file}</p>
          <p className="text-[11px] text-faded">{w.download}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-3 py-2 text-on-ink">
        <span className="text-[13px] font-medium">{w.pay}</span>
        <span className="text-[13px] font-semibold">$19</span>
      </div>
    </div>
  )
}

function CsvRescue({ w }) {
  const rows = [w.cols, ['0012', 'Kaffekopp'], ['0040', 'Smörkniv']]
  return (
    <div className={`${panel} w-[min(15rem,86%)] overflow-hidden text-left`}>
      <table className="w-full font-mono text-[11.5px]">
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={r === 0 ? 'bg-canvas text-faded' : 'border-t border-line text-ink'}>
              {row.map((cell, c) => (
                <td key={c} className="px-3 py-1.5">
                  {cell}
                  {r > 0 && c === 0 && <span className="ml-1 text-live">✓</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-3 py-1.5 font-mono text-[10px] text-faded">{w.csvFoot}</p>
    </div>
  )
}

function Failclosed({ w }) {
  return (
    <div className="flex w-[min(24rem,90%)] items-center justify-center gap-3">
      {[[w.shop, '12'], [w.warehouse, '12']].map(([label, n], i) => (
        <div key={label} className="contents">
          {i === 1 && (
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-live">{w.fixed}</span>
              <span className="text-lg leading-none text-ink">⇄</span>
              <span className="font-mono text-[10px] text-iris">{w.held}</span>
            </div>
          )}
          <div className={`${panel} min-w-0 flex-1 p-3 text-left`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faded">{label}</p>
            <p className="mt-1 text-[22px] font-semibold tracking-tight text-ink">{n}</p>
            <p className="text-[11px] text-faded">{w.inStock}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function AIklart({ w }) {
  return (
    <div className={`${panel} w-[min(19rem,88%)] p-4 text-left`}>
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold tracking-tight text-ink">{w.policy}</p>
        <span className={ok}>{w.done}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {[92, 78, 86, 54].map((w) => (
          <span key={w} className="block h-[6px] rounded-full bg-canvas-2" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-3 flex gap-1.5">
        {w.parts.map((t) => (
          <span key={t} className="rounded-md bg-canvas px-1.5 py-0.5 text-[10.5px] text-ink-2">{t}</span>
        ))}
      </div>
    </div>
  )
}

const STARS = [
  [12, 30], [24, 62], [34, 22], [46, 74], [55, 40], [66, 18], [72, 66], [84, 36], [90, 72], [18, 82], [40, 52], [78, 52],
]
function Expanse({ w }) {
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[[0, 10], [10, 4], [4, 7], [7, 11], [11, 1], [2, 5], [5, 8], [8, 6]].map(([a, b]) => (
          <line key={`${a}-${b}`} x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]} stroke="rgba(12,12,14,0.14)" strokeWidth="0.35" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {STARS.map(([x, y], i) => (
        <span
          key={i}
          className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${i === 10 ? 'bg-iris shadow-[0_0_0_5px_rgba(91,67,240,0.18)]' : 'bg-[rgba(12,12,14,0.55)]'}`}
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      <span
        className={`${panel} absolute whitespace-nowrap px-2.5 py-1 text-[11.5px] font-medium text-ink`}
        style={{ left: '40%', top: '52%', transform: 'translate(-50%, -170%)' }}
      >
        {w.yours}
      </span>
    </div>
  )
}

const VISUALS = {
  DeployDoctor,
  Vatidence,
  StayTag,
  'Nytto Checkout': Checkout,
  'CSV Rescue': CsvRescue,
  Failclosed,
  AIklart,
  Expanse,
}

export default function ToolVisual({ name, locale }) {
  const Visual = VISUALS[name]
  return Visual ? <Visual w={WORDS[locale] || WORDS.en} /> : null
}
