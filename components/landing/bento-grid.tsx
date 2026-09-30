'use client'

import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { API_ENDPOINTS, LEGACY_ANCHORS, PRODUCT_ACCENTS, PRODUCT_ANCHORS, endpointUrl, statusLabel } from './data'
import {
  CopyButton,
  DeployDoctorPreview,
  FailclosedPreview,
  NyttoCheckoutPreview,
  StayTagPreview,
  VatidencePreview,
} from './previews'
import type { PublicProduct } from './types'
import s from './landing.module.css'

type Notify = (message: string) => void

function hostOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// Updates the spotlight position used by the tile's ::before/::after glow.
function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

interface TileProps {
  id?: string
  className: string
  accent: string
  children: ReactNode
  labelledBy?: string
}

function Tile({ id, className, accent, children, labelledBy }: TileProps) {
  return (
    <article
      id={id}
      className={`${s.tile} ${s.anchor} ${className}`}
      style={{ '--tile-accent': accent } as CSSProperties}
      onPointerMove={trackPointer}
      aria-labelledby={labelledBy}
    >
      {children}
    </article>
  )
}

// Desktop grid is 6 columns: DeployDoctor (newest) spans the full row, the
// rest pair up at half width. Anything not listed falls back to half width.
const TILE_CLASS: Record<string, string> = {
  deploydoctor: `${s.tileFeature} ${s.tileWide}`,
  'curl-to-buy': `${s.tileHalf} ${s.tileWide}`,
}
const FEATURED = 'deploydoctor'

function ProductTile({ product, notify }: { product: PublicProduct; notify: Notify }) {
  const anchor = PRODUCT_ANCHORS[product.slug] ?? product.slug
  const accent = PRODUCT_ACCENTS[product.slug] ?? '#00f5ff'
  const titleId = `tile-title-${anchor}`

  let preview: ReactNode = null
  if (product.slug === 'cycletag') preview = <StayTagPreview />
  else if (product.slug === 'viesproof') preview = <VatidencePreview productUrl={product.url} />
  else if (product.slug === 'curl-to-buy') preview = <NyttoCheckoutPreview productUrl={product.url} notify={notify} />
  else if (product.slug === 'deploydoctor') preview = <DeployDoctorPreview />
  else if (product.slug === 'failclosed') preview = <FailclosedPreview />

  return (
    <Tile id={anchor} className={TILE_CLASS[product.slug] ?? s.tileHalf} accent={accent} labelledBy={titleId}>
      {(LEGACY_ANCHORS[product.slug] ?? []).map((legacy) => (
        <span key={legacy} id={legacy} className={s.anchorAlias} aria-hidden="true" />
      ))}
      <div className={s.tileTop}>
        <span className={`${s.tileCat} ${s.mono}`}>{product.category}</span>
        <span style={{ display: 'inline-flex', gap: 6 }}>
          {product.slug === FEATURED && <span className={`${s.status} ${s.statusNew} ${s.mono}`}>New</span>}
          <span className={`${s.status} ${s.mono}`}>
            <span className={product.status === 'live' ? s.statusDot : s.statusDotInvite} aria-hidden="true" />
            {statusLabel(product.status)}
          </span>
        </span>
      </div>
      <h3 id={titleId} className={s.productTitle}>
        {product.name}
      </h3>
      <p className={s.tileDesc}>{product.description}</p>
      {preview}
      <div className={`${s.tileFoot} ${s.mono}`}>
        <span>{product.primaryMarket}</span>
        {/* Products without a published domain in the catalog render without a link. */}
        {product.url && (
          <a href={product.url} target="_blank" rel="noreferrer" className={s.tileLink}>
            {hostOf(product.url)} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </Tile>
  )
}

function RelayTile({ notify }: { notify: Notify }) {
  return (
    <Tile className={s.tileRelay} accent="#00f5ff" labelledBy="tile-title-relay">
      <div className={s.tileTop}>
        <span className={`${s.tileCat} ${s.mono}`}>Underneath</span>
      </div>
      <h3 id="tile-title-relay" className={s.productTitle}>
        Nytto Relay
      </h3>
      <p className={s.tileDesc}>The routing layer that turns intent from each product into an approved next action.</p>
      <ul className={s.endpointList}>
        {API_ENDPOINTS.map((ep) => (
          <li key={ep.id} className={`${s.endpoint} ${s.mono}`}>
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span className={s.method}>{ep.method}</span>
              {ep.path}
            </span>
            <CopyButton text={endpointUrl(ep.path)} label={`${ep.method} ${ep.path}`} notify={notify} />
          </li>
        ))}
      </ul>
      <div className={`${s.tileFoot} ${s.mono}`}>
        <span>Deterministic · fail-closed</span>
        <a href="#relay" className={s.tileLink}>
          How it works →
        </a>
      </div>
    </Tile>
  )
}

export default function BentoGrid({ products, notify }: { products: PublicProduct[]; notify: Notify }) {
  return (
    <div className={s.bento}>
      {products.map((p) => (
        <ProductTile key={p.slug} product={p} notify={notify} />
      ))}
      <RelayTile notify={notify} />
    </div>
  )
}
