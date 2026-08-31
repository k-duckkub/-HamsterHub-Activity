import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** ฟอนต์ไทยของ OG ต้องฝังมาเอง เพราะ runtime ไม่มีฟอนต์ระบบ */
async function thaiFont(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      'https://fonts.gstatic.com/s/notosansthai/v25/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf'
    )
    if (!response.ok) return null
    return await response.arrayBuffer()
  } catch {
    return null
  }
}

/** การ์ดแชร์ของ HamsterHub — ชื่อจริงของรายการบนพื้น Ink พร้อมเส้นสีแบรนด์ */
export async function brandCard(options: {
  eyebrow: string
  title: string
  meta?: string
}): Promise<ImageResponse> {
  const font = await thaiFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A1A2F',
          padding: '72px 80px',
          fontFamily: font ? 'Noto Sans Thai' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 44, background: '#FF6B00', borderRadius: 999 }} />
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              color: '#FFFFFF',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            HAMSTER <span style={{ color: '#FF6B00', marginLeft: 10 }}>HUB</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 30, color: '#FF6B00', fontWeight: 600 }}>{options.eyebrow}</div>
          <div style={{ fontSize: 76, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.15 }}>
            {options.title}
          </div>
          {options.meta && (
            <div style={{ fontSize: 30, color: '#94A0AD' }}>{options.meta}</div>
          )}
        </div>

        <div style={{ height: 8, background: '#FF6B00', borderRadius: 999, width: 220 }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font
        ? [{ name: 'Noto Sans Thai', data: font, style: 'normal' as const, weight: 700 as const }]
        : undefined,
    }
  )
}
