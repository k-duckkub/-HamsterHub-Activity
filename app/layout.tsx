import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Noto_Sans_Thai, Roboto } from 'next/font/google'
import './globals.css'
import MobileTabBar from '@/components/navigation/MobileTabBar'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-latin',
})

// ฟอนต์ของเนื้อหาทั้งเว็บ คู่เดียวกับที่ YouTube ใช้
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
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
    <html lang="th" className={`${jakarta.variable} ${roboto.variable} ${thai.variable}`}>
      <head>
        {/* โหลด sprite sheet ล่วงหน้า กันการ์ดกระตุกตอนไอคอนเข้าเฟรมแรก */}
        <link rel="preload" as="image" href="/assets/hamsterhub-space-icons.png" />
      </head>
      <body
        style={
          {
            ['--font-ui' as string]: `var(--font-body), var(--font-thai)`,
            // แถบบนสุดยังใช้ฟอนต์เดิมของแบรนด์
            ['--font-brand' as string]: `var(--font-latin), var(--font-thai)`,
          } as React.CSSProperties
        }
      >
        {children}
        <MobileTabBar />
      </body>
    </html>
  )
}
