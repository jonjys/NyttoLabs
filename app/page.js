import HomeView from './home-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — CycleTag and VIESproof',
  description: 'Buy CycleTag reorder labels from 49 SEK or pay for a VIESproof VAT check from €4.90. Other tools live under Products.',
  path: '/',
})

export default function Page() {
  return <HomeView />
}
