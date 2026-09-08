'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Route, Layers, FileUp } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import ProductCard from '@/components/site/product-card'
import { usePublicProducts } from '@/hooks/use-public-catalog'
import { groupPublicProductsByStatus } from '@/lib/relay/catalog'

export default function HomeView() {
  const products = usePublicProducts()
  const groups = groupPublicProductsByStatus(products)

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
            <a href="https://pay.nyttolabs.com/upload" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900">
              <FileUp className="h-4 w-4" /> Sell a file
            </a>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1b1b16] transition hover:border-black/30">
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Curl-to-Buy promo strip */}
      <section className="border-y border-emerald-900/15 bg-emerald-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Curl-to-Buy is live →</p>
            <p className="mt-0.5 text-sm text-emerald-800/80">
              Upload any file, set a price in kr, share the link. Buyers pay with card or Klarna. No account needed.
            </p>
          </div>
          <a
            href="https://pay.nyttolabs.com/upload"
            className="shrink-0 inline-flex min-h-10 items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Start selling <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">What we build</h2>
            <p className="mt-1 text-sm text-[#6a6858]">Products are the public proof of the company — each keeps its own identity.</p>
          </div>
          <Link href="/products" className="shrink-0 text-sm font-medium text-emerald-800 hover:text-emerald-900">View all</Link>
        </div>
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.key} className="mt-10 first:mt-5">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <p className="text-sm text-[#8a8778]">{group.desc}</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {group.list.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-black/15 bg-white px-5 py-8 text-sm text-[#6a6858]">
            Product listings are temporarily unavailable. See <Link href="/products" className="underline">all products</Link> or try again shortly.
          </p>
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
