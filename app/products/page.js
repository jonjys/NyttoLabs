import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'The public Nytto Labs portfolio: CycleTag, VIESProof, GateZero, and Failclosed — proof of what the company builds.',
  path: '/products',
})

export default function Page() {
  return <ProductsView />
}
