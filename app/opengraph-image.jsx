import { ImageResponse } from 'next/og'
import { TOOLS } from '@/lib/tools'

export const alt = 'Nytto Labs — small tools that finish the job'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const AI = 'linear-gradient(110deg, #5b43f0 0%, #b04bff 35%, #ff5c8a 68%, #ffb547 100%)'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f6f6f3',
          color: '#0c0c0e',
          padding: '58px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -160,
            top: -220,
            width: 760,
            height: 560,
            borderRadius: 9999,
            background: AI,
            opacity: 0.22,
            filter: 'blur(90px)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 600 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: '#0c0c0e', color: '#f6f6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>N</div>
            Nytto Labs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#3a3a40' }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: '#0f7a45' }} />
            {`${TOOLS.length} tools live · Stockholm`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.05em' }}>
          <span>Small tools that</span>
          <span style={{ display: 'flex' }}>
            <span style={{ color: '#5b43f0', fontStyle: 'italic', marginRight: 22 }}>finish</span>
            the job.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', padding: 2, borderRadius: 26, background: AI, width: 760 }}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', borderRadius: 24, background: '#ffffff', padding: '18px 18px 18px 26px', fontSize: 26, color: '#64646c' }}>
              Describe the job…
              <div style={{ width: 48, height: 48, borderRadius: 9999, background: '#0c0c0e', color: '#f6f6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>↑</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {TOOLS.map((tool) => (
              <div key={tool.name} style={{ display: 'flex', padding: '8px 16px', borderRadius: 999, background: '#ffffff', border: '1px solid #e3e3de', fontSize: 19, color: '#3a3a40' }}>
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
