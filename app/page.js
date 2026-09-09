import HomeView from './home-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — CycleTag och VIESproof',
  description: 'Köp CycleTag-återbeställningsetiketter eller betala för en VIESproof-kontroll direkt. Fler verktyg från Nytto Labs finns under Produkter.',
  path: '/',
})

export default function Page() {
  return <HomeView />
}
