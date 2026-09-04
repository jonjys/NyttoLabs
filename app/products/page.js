'use client'

import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import ProductCard from '@/components/site/product-card'
import { usePublicProducts } from '@/hooks/use-public-catalog'

export default function ProductsPage() {
  const products = usePublicProducts()

  const groups = [
    { key: 'live', title: 'Live', desc: 'Available today.' },
    { key: 'building', title: 'Building', desc: 'In active development.' },
  ]

  const grouped = groups.map((g) => ({ ...g, list: products.filter((p) => p.status === g.key) }))
  const hasAny = grouped.some((g) => g.list.length > 0)

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-6">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Products</h1>
        <p className="mt-3 max-w-2xl text-[#4a4a3e]">
          A small portfolio of focused products. Each keeps its own identity; Nytto Labs owns the
          underlying software, partner relationships, and routing infrastructure.
        </p>
      </section>
      {grouped.map((g) => {
        if (g.list.length === 0) return null
        return (
          <section key={g.key} className="mx-auto max-w-6xl px-5 py-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <p className="text-sm text-[#8a8778]">{g.desc}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.list.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </section>
        )
      })}
      {!hasAny && (
        <section className="mx-auto max-w-6xl px-5 py-6">
          <div className="rounded-xl border border-dashed border-black/15 bg-white px-5 py-10 text-sm text-[#6a6858]">
            No products to show right now. Please refresh, or contact us via the contact page.
          </div>
        </section>
      )}
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-[#4a4a3e]">
          Live product URLs for CycleTag, VIESProof, and GateZero are kept in code so a stale database
          row cannot send visitors to the wrong site. New products can still be added from the control plane.
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
