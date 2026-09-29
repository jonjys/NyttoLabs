import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Four live products: DeployDoctor Vercel checks, CycleTag reorder labels, Vatidence VAT checks and Curl-to-Buy file sales. Swedish software, F-tax.',
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
