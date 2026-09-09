import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Products — Nytto Labs',
  description: 'All Nytto Labs products: CycleTag, VIESproof, GateZero, FailClosed and the rest of the lab.',
  path: '/products',
})

export default function Page() {
  return <ProductsView />
}
