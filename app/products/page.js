import ProductsView from './products-view'
import { PRODUCTS_DESCRIPTION, pageMetadata } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/site/json-ld'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: PRODUCTS_DESCRIPTION,
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
