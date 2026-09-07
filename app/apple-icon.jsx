import { ImageResponse } from 'next/og'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c3329', color: '#dcf7a1', fontSize: 88, fontWeight: 700 }}>N</div>, size)
}
