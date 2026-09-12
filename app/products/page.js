import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'Every Nytto Labs product: CycleTag, VIESproof, Curl-to-Buy, GateZero and Failclosed — what the company builds.',
  path: '/products',
})

export default function Page() {
  return <ProductsView />
}
