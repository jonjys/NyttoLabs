import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Five live products: DeployDoctor Vercel checks, StayTag reorder labels, Vatidence VAT checks, Nytto Checkout file sales and Failclosed inventory sync. Swedish software, F-tax.',
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
