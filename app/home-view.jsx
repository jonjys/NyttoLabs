'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Route, Layers } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import ProductCard from '@/components/site/product-card'
import { usePublicProducts } from '@/hooks/use-public-catalog'

export default function HomeView() {
  const products = usePublicProducts()
  const live = products.filter((p) => p.status === 'live')
  const building = products.filter((p) => p.status === 'building' || p.status === 'public-beta')

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />

      <section className="mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#6a6858]">
            Nytto Labs · Sweden
          </span>
          <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            Focused software.<br />Invisible infrastructure.<br />
            <span className="text-emerald-800">Practical outcomes.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a4a3e]">
            Nytto Labs is a software company. We build small, sharp products — and quietly connect people
            to the right next product, service, or action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] transition hover:bg-black">
              See what we build <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">What we build</h2>
            <p className="mt-1 text-sm text-[#6a6858]">Products are the public proof of the company — each keeps its own identity.</p>
          </div>
          <Link href="/products" className="shrink-0 text-sm font-medium text-emerald-800 hover:text-emerald-900">View all</Link>
        </div>
        {live.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {live.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-black/15 bg-white px-5 py-8 text-sm text-[#6a6858]">
            Product listings are temporarily unavailable. See <Link href="/products" className="underline">all products</Link> or try again shortly.
          </p>
        )}
        {building.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold">Building</h3>
            <p className="text-sm text-[#8a8778]">In active development — not marked live.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {building.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Layers, title: 'One thing, done well', body: 'Each product keeps its own identity and solves a single, sharp problem for its users.' },
            { icon: Route, title: 'The right next action', body: 'When a real need appears, we route people to a relevant, useful destination — never spam.' },
            { icon: ShieldCheck, title: 'Privacy by default', body: 'We store the minimum anonymous commercial context. No personal data powers the routing.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-black/10 bg-white p-6">
              <f.icon className="h-5 w-5 text-emerald-800" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a4a3e]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold">Work with Nytto Labs</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4a3e]">
              Partnerships and general questions go to the same inbox. You keep checkout, payment, and
              fulfilment. We handle relevant, disclosed routing where a product needs it.
            </p>
          </div>
          <Link href="/partners" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] hover:bg-black">
            Partner with us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
