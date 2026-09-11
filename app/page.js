import HomeView from './home-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Nytto Labs — Focused software from Stockholm',
  description: 'Nytto Labs is a Swedish software company. Step into the lobby and pick a door: Products, Partners, or Contact.',
  path: '/',
})

export default function Page() {
  return <HomeView />
}
