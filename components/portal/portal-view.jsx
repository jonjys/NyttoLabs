import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Grid2X2, Layers, ShieldCheck, Bookmark } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import { PORTAL_PRODUCTS } from '@/lib/portal/catalog'
import ProductIcon from './product-icon'
import CatalogBrowser from './catalog-browser'
import './portal.css'

export default function PortalView({ directory = false }) {
  return (
    <div className="portal-page">
      <a href="#portal-main" className="portal-skip">Skip to products</a>
      <SiteNav />
      <main id="portal-main">
        {!directory ? <section className="portal-hero portal-container" aria-labelledby="portal-title">
          <div className="portal-hero-copy">
            <p className="portal-eyebrow"><span /> INDEPENDENT SOFTWARE · SWEDEN</p>
            <h1 id="portal-title">Small tools.<br /><em>Work, handled.</em></h1>
            <p className="portal-hero-description">Reorder the right part. Check the numbers. Keep the evidence. Nine focused products, built by Nytto Labs to make the next step easier.</p>
            <div className="portal-hero-actions">
              <a href="#products" className="portal-button">Find your tool <ArrowRight size={18} aria-hidden="true" /></a>
              <a href="https://cycletag.eu/" className="portal-text-link">Try CycleTag free <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="portal-hero-note"><Grid2X2 size={15} aria-hidden="true" /> 9 products <span>·</span> Open directly in your browser</p>
          </div>
          <div className="portal-launcher" aria-label="Product shortcuts">
            <div className="portal-launcher-header"><span>THE NYTTO TOOLBOX</span><span>01—09</span></div>
            <div className="portal-launcher-grid">
              {PORTAL_PRODUCTS.map((product) => <a key={product.slug} href={`/products#product-${product.slug}`} aria-label={`Find ${product.name}`}><ProductIcon product={product} /><span>{product.slug === 'curl-to-buy' ? 'Curl-to-Buy' : product.name}</span></a>)}
            </div>
            <div className="portal-launcher-footer"><span>Built to do a useful job.</span><ArrowRight size={17} aria-hidden="true" /></div>
          </div>
        </section> : <section className="portal-directory-hero portal-container">
          <p className="portal-eyebrow">THE NYTTO TOOLBOX</p>
          <h1>Find the tool.<br /><em>Get on with your day.</em></h1>
          <p>Nine independent products for everyday tasks, business operations and developers. Search by the job you need done, or bookmark your regulars.</p>
        </section>}

        <section id="products" className="portal-container portal-products" aria-labelledby="products-title">
          <div className="portal-section-heading"><div><p className="portal-eyebrow">EXPLORE THE ECOSYSTEM</p><h2 id="products-title">A small tool for the next big task.</h2></div><span className="portal-count">09 / PRODUCTS</span></div>
          <CatalogBrowser />
        </section>

        <section className="portal-principles portal-container" aria-label="How Nytto Labs products work">
          {[
            { icon: Layers, title: 'One studio. Independent tools.', text: 'Each product keeps its own purpose, identity and workflow. Open the tool you need, when you need it.' },
            { icon: ShieldCheck, title: 'Know what you are opening.', text: 'Live, beta and demo labels make availability clear. Access requirements and charges are explained in each product.' },
            { icon: Bookmark, title: 'Make the toolbox yours.', text: 'Save your regular tools in this browser. No portal account needed, and no bookmarks uploaded to our servers.' },
          ].map(({ icon: Icon, title, text }) => <div key={title}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /><h2>{title}</h2><p>{text}</p></div>)}
        </section>

        <section className="portal-container portal-about" aria-labelledby="studio-title">
          <div><p className="portal-eyebrow">FROM THE LAB</p><h2 id="studio-title">Focused software.<br /><em>Practical outcomes.</em></h2></div>
          <div><p>Nytto Labs is an independent software company in Sweden. We build useful products for the jobs that fall between bigger systems — from a replacement label to an inventory check.</p><p>Have a question, feedback or a product that belongs alongside ours?</p><div className="portal-hero-actions"><Link href="/contact" className="portal-text-link">Talk to Nytto Labs <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/partners" className="portal-text-link">Partnerships <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
