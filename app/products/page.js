'use client'

import { useEffect, useState } from 'react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import ProductCard from '@/components/site/product-card'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/public/products').then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {})
  }, [])

  const groups = [
    { key: 'live', title: 'Live', desc: 'Available today.' },
    { key: 'building', title: 'Building', desc: 'In active development.' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="mt-3 max-w-2xl text-[#4a4a3e]">
          A small portfolio of focused products. Each keeps its own identity; Nytto Labs owns the
          underlying software, partner relationships, and routing infrastructure.
        </p>
      </section>
      {groups.map((g) => {
        const list = products.filter((p) => p.status === g.key)
        if (list.length === 0) return null
        return (
          <section key={g.key} className="mx-auto max-w-6xl px-5 py-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <p className="text-sm text-[#8a8778]">{g.desc}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </section>
        )
      })}
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-[#4a4a3e]">
          Product entries are driven from configuration in the Nytto Labs control plane, not hardcoded.
          New products can be added without code changes.
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
