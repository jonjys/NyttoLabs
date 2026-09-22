import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Buy CycleTag reorder labels, pay for a Vatidence VAT check, or sell a file with Curl-to-Buy. Swedish software, F-tax.',
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
