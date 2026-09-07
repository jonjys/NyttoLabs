import { ImageResponse } from 'next/og'
import { PORTAL_PRODUCTS } from '@/lib/portal/catalog'

export const alt = 'Nytto Labs — Small tools. Work, handled.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#f7f5f0', color: '#1c3329', padding: 62, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: '0.12em' }}><span>NYTTO LABS</span><span>INDEPENDENT SOFTWARE · SWEDEN</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.05em' }}><span>Small tools.</span><span style={{ color: '#357353' }}>Work, handled.</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>{PORTAL_PRODUCTS.map((product) => <div key={product.slug} style={{ display: 'flex', background: '#e6ecdf', borderRadius: 10, padding: '12px 18px', fontSize: 20 }}>{product.slug === 'curl-to-buy' ? 'Curl-to-Buy' : product.name}</div>)}</div>
    </div>, size,
  )
}
