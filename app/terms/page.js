import TermsView from './terms-view'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Terms — Nytto Labs',
  description: 'Terms for the Nytto Labs website. Nytto Labs, operated by Fredrik Kornelind (Sweden).',
  path: '/terms',
})

export default function Page() {
  return <TermsView />
}
