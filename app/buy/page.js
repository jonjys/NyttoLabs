import BuyView from './buy-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Buy — Nytto Labs',
  description: 'Buy CycleTag reorder labels, pay for a Vatidence VAT check, or sell a file with Curl-to-Buy. Swedish software, F-tax. The rest of the lab lives under Products.',
  path: '/buy',
})

export default function Page() {
  return <BuyView />
}
