import HomeView from './home-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — Focused software. Invisible infrastructure.',
  description: 'Nytto Labs builds focused digital products and quietly connects people to the right next product, service, or action.',
  path: '/',
})

export default function Page() {
  return <HomeView />
}
