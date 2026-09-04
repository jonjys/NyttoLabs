import TermsView from './terms-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Terms — Nytto Labs',
  description: 'Terms for the Nytto Labs website. Operated by Nytto Labs, Sweden.',
  path: '/terms',
})

export default function Page() {
  return <TermsView />
}
