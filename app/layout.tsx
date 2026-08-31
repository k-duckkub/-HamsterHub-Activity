import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Sarabun, Roboto } from 'next/font/google'
import './globals.css'
import MobileTabBar from '@/components/navigation/MobileTabBar'
import ActivityIntroTransition from '@/components/transitions/ActivityIntroTransition'
import { ToastProvider } from '@/components/ui/Toast'

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

// สำรองไว้ให้เครื่องที่ไม่มีฟอนต์ไทยของระบบ
const thai = Sarabun({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-thai',
})

/**
 * ไทยใช้ฟอนต์ของระบบก่อนเสมอ เหมือนที่ YouTube ทำ
 * (Windows = Leelawadee UI, macOS/iOS = Thonburi, Android = Noto Sans Thai)
 */
const THAI_STACK =
  `'Leelawadee UI', Leelawadee, Thonburi, 'Noto Sans Thai', var(--font-thai)`

/** โดเมนจริงของโปรเจกต์ ใช้ทำลิงก์เต็มให้ canonical และ OG */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://hamster-hub-activity-git-claude-hams-d64322-k-duckkubs-projects.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'HamsterHub — สำรวจ',
  description: 'เลือกพื้นที่ของคุณบน HamsterHub',
  openGraph: {
    type: 'website',
    siteName: 'HamsterHub',
    locale: 'th_TH',
  },
  twitter: { card: 'summary_large_image' },
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
            ['--font-ui' as string]: `var(--font-body), ${THAI_STACK}`,
            // แถบบนสุดยังใช้ฟอนต์เดิมของแบรนด์
            ['--font-brand' as string]: `var(--font-latin), ${THAI_STACK}`,
          } as React.CSSProperties
        }
      >
        <ToastProvider>
          {children}
          <MobileTabBar />
        {/* อยู่นอกหน้า เพื่อให้ overlay รอดข้ามการเปลี่ยน route */}
          <ActivityIntroTransition />
        </ToastProvider>
      </body>
    </html>
  )
}
