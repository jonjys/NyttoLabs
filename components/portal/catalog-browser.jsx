'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Bookmark, Search, X } from 'lucide-react'
import { PORTAL_PRODUCTS, PORTAL_CATEGORIES, filterPortalProducts, parseSavedProducts } from '@/lib/portal/catalog'
import ProductIcon from './product-icon'

const STORAGE_KEY = 'nyttolabs:portal:saved:v1'

export default function CatalogBrowser() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState([])
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try { setSaved(parseSavedProducts(localStorage.getItem(STORAGE_KEY))) } catch { /* Storage may be disabled. */ }
    setReady(true)
    const sync = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setSaved(parseSavedProducts(event.newValue))
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function toggleSaved(product) {
    const next = saved.includes(product.slug) ? saved.filter((slug) => slug !== product.slug) : [...saved, product.slug]
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setNotice(`${product.name} ${next.includes(product.slug) ? 'saved on this device' : 'removed from saved products'}.`)
    } catch {
      setNotice('Your browser blocked saving. Favorites will last for this visit only.')
    }
  }

  function reset() { setQuery(''); setCategory('all'); setSavedOnly(false) }
  const products = filterPortalProducts({ query, category, savedOnly, saved })

  return (
    <div className="portal-catalog">
      <div className="portal-search-row">
        <div className="portal-search">
          <Search aria-hidden="true" size={20} />
          <label htmlFor="product-search" className="sr-only">Search products by name or task</label>
          <input id="product-search" type="search" placeholder="What do you need to get done?" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}
        </div>
        <button type="button" className={`portal-saved-filter${savedOnly ? ' is-active' : ''}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}>
          <Bookmark size={17} aria-hidden="true" /> Saved <span>{saved.length}</span>
        </button>
      </div>
      <div className="portal-filters" role="group" aria-label="Filter products by use">
        {PORTAL_CATEGORIES.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} className={category === item.id ? 'is-active' : ''} onClick={() => setCategory(item.id)}>{item.label}</button>)}
      </div>
      <div className="portal-results-line">
        <p role="status" aria-live="polite" aria-atomic="true">{products.length} of {PORTAL_PRODUCTS.length} products{savedOnly ? ' · saved on this device' : ''}</p>
        <span>Independent products. One home.</span>
      </div>
      <div className="portal-grid">
        {products.map((product) => {
          const isSaved = saved.includes(product.slug)
          const preview = product.url !== product.canonicalUrl
          return (
            <article className="portal-card" key={product.slug} id={`product-${product.slug}`}>
              <div className="portal-card-top">
                <ProductIcon product={product} />
                <span className={`portal-status${product.status === 'Live' ? ' is-live' : ''}`}>{product.status}</span>
                <button type="button" className={`portal-bookmark${isSaved ? ' is-saved' : ''}`} disabled={!ready} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(product)}><Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} /></button>
              </div>
              <p className="portal-card-type">{PORTAL_CATEGORIES.find((c) => c.id === product.category)?.label}</p>
              <h3>{product.name}</h3>
              <p className="portal-tagline">{product.tagline}</p>
              <p className="portal-description">{product.description}</p>
              <p className="portal-detail">{product.detail}</p>
              <div className="portal-card-bottom">
                <a href={product.url} className="portal-product-link">{product.action}<ArrowUpRight size={18} aria-hidden="true" /></a>
                <span className="portal-domain">{new URL(product.url).hostname}{preview ? ' · preview' : ''}</span>
              </div>
            </article>
          )
        })}
      </div>
      {products.length === 0 && <div className="portal-empty">
        <Search size={28} aria-hidden="true" />
        <h3>{savedOnly && !saved.length ? 'Your shortcuts start here.' : 'No matching products yet.'}</h3>
        <p>{savedOnly && !saved.length ? 'Use the bookmark on any product to save it on this device.' : 'Try a product name or a task like “VAT”, “labels” or “webhook”.'}</p>
        <button type="button" onClick={reset}>Show all products</button>
      </div>}
      <p className="sr-only" role="status" aria-live="polite">{notice}</p>
      <p className="portal-catalog-note">Bookmarks stay in this browser. Each product has its own access, pricing and privacy terms. Preview and demo products are still being developed.</p>
    </div>
  )
}
