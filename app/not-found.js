import Link from 'next/link'
import SiteNav from '@/components/site/nav'
import SiteFooter from '@/components/site/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b1b16]">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-5 py-24">
        <p className="text-sm font-medium text-[#8a8778]">404</p>
        <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight">This page is not here.</h1>
        <p className="mt-4 max-w-md text-[#4a4a3e]">The address may have changed, or it never existed. The public site lives at Home, Products, Partners, Contact, Privacy, and Terms.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-md bg-[#1b1b16] px-5 py-2.5 text-sm font-medium text-[#f7f5f0] hover:bg-black">Back home</Link>
          <Link href="/products" className="rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-medium hover:border-black/30">Products</Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
