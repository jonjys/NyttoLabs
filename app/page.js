import HomeView from './home-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — CycleTag and VIESproof',
  description: 'Buy CycleTag from $5 (49 SEK) or VIESproof from $6 (€4.90). Other tools live under Products.',
  path: '/',
})

export default function Page() {
  return <HomeView />
}
