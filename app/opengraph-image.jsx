import { ImageResponse } from 'next/og'

export const alt = 'Nytto Labs — Focused software from Stockholm'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PORTALS = [
  { label: 'PARTNERS', color: '#ff2bd1' },
  { label: 'PRODUCTS', color: '#00ff9d' },
  { label: 'CONTACT', color: '#ff8a1e' },
]

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#03030c',
          color: '#ffffff',
          padding: 62,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,245,255,0.20) 0%, transparent 70%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <span>NYTTO LABS</span>
          <span>STOCKHOLM · SWEDEN</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 78,
            lineHeight: 1.03,
            fontWeight: 800,
            letterSpacing: '-0.045em',
          }}
        >
          <span>Focused software.</span>
          <span style={{ color: '#00f5ff' }}>Built to be used.</span>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {PORTALS.map((p) => (
            <div
              key={p.label}
              style={{
                display: 'flex',
                borderRadius: 999,
                padding: '12px 26px',
                fontSize: 19,
                letterSpacing: '0.2em',
                color: p.color,
                border: `1px solid ${p.color}66`,
                background: `${p.color}14`,
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
