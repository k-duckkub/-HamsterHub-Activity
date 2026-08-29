import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-latin',
})

const thai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-thai',
})

export const metadata: Metadata = {
  title: 'HamsterHub — สำรวจ',
  description: 'เลือกพื้นที่ของคุณบน HamsterHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${jakarta.variable} ${thai.variable}`}>
      <head>
        {/* โหลด sprite sheet ล่วงหน้า กันการ์ดกระตุกตอนไอคอนเข้าเฟรมแรก */}
        <link rel="preload" as="image" href="/assets/hamsterhub-space-icons.png" />
      </head>
      <body
        style={
          {
            ['--font-ui' as string]: `var(--font-latin), var(--font-thai)`,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
