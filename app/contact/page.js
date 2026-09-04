'use client'

import { Mail, Handshake } from 'lucide-react'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'
import Link from 'next/link'
import { usePublicSettings } from '@/hooks/use-public-catalog'

export default function ContactPage() {
  const s = usePublicSettings()
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Contact</h1>
        <p className="mt-4 text-[#4a4a3e]">We keep it simple. Reach the right inbox directly.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <Mail className="h-5 w-5 text-emerald-800" />
            <h3 className="mt-4 font-semibold">General</h3>
            <a className="mt-1 block text-sm text-emerald-800 underline" href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <Handshake className="h-5 w-5 text-emerald-800" />
            <h3 className="mt-4 font-semibold">Partnerships</h3>
            <a className="mt-1 block text-sm text-emerald-800 underline" href={`mailto:${s.partnerEmail}`}>{s.partnerEmail}</a>
            <Link href="/partners" className="mt-3 inline-block text-sm font-medium text-[#1b1b16] underline">Open the partner inquiry form</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
