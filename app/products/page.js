import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Six live products: DeployDoctor Vercel checks, CycleTag reorder labels, Vatidence VAT checks, Curl-to-Buy file sales, LiveProof uptime attestation and Failclosed access control. Swedish software, F-tax.',
  path: '/products',
})

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd name="Products" path="/products" />
      <ProductsView />
    </>
  )
}
