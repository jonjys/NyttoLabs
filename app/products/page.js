import ProductsView from './products-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Produkter — Nytto Labs',
  description: 'Alla Nytto Labs-produkter: CycleTag, VIESproof, GateZero och Failclosed — vad bolaget bygger.',
  path: '/products',
})

export default function Page() {
  return <ProductsView />
}
