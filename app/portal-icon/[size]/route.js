import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export function generateStaticParams() { return [{ size: '192' }, { size: '512' }] }

export async function GET(_request, { params }) {
  const { size: value } = await params
  if (value !== '192' && value !== '512') return new Response('Not found', { status: 404 })
  const size = Number(value)
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c3329', color: '#dcf7a1', fontSize: size * 0.48, fontWeight: 700 }}>N</div>,
    { width: size, height: size },
  )
}
