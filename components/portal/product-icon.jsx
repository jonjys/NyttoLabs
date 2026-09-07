import { QrCode, Network, BadgeCheck, FileDown, GitCompare, Webhook, Stamp, Files, ScanSearch } from 'lucide-react'

const icons = { QrCode, Network, BadgeCheck, FileDown, GitCompare, Webhook, Stamp, Files, ScanSearch }

export default function ProductIcon({ product, small = false }) {
  const Icon = icons[product.icon] || QrCode
  return <span className={`portal-icon portal-color-${product.color}${small ? ' portal-icon-small' : ''}`} aria-hidden="true"><Icon strokeWidth={1.7} /></span>
}
