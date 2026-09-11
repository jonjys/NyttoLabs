import BuyView from './buy-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Buy — Nytto Labs',
  description: 'Buy CycleTag reorder labels or pay for a VIESproof VAT check. Swedish software, F-tax. The rest of the lab lives under Products.',
  path: '/buy',
})

export default function Page() {
  return <BuyView />
}
