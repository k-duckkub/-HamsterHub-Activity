'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Home, PlaySquare, User } from 'lucide-react'
import { useRipple } from '@/components/ui/RippleSurface'
import { COMING_SOON } from '@/lib/navigation'

type Tab = {
  /** ปลายทาง คิดจาก path ปัจจุบัน เพราะบางแท็บผูกกับกิจกรรมที่กำลังดูอยู่ */
  href: (path: string) => string | null
  label: string
  Icon: typeof Home
  /** แท็บนี้ถือว่าเลือกอยู่เมื่อ path ปัจจุบันเข้าเงื่อนไขนี้ */
  match: (path: string) => boolean
}

/** สลัคของกิจกรรมที่กำลังดูอยู่ ถ้ามี */
const slugOf = (path: string) => path.match(/^\/activity\/([^/]+)/)?.[1]

const tabs: Tab[] = [
  { href: () => '/explore', label: 'หน้าแรก', Icon: Home, match: (p) => p === '/explore' },
  {
    href: () => '/explore',
    label: 'กิจกรรม',
    Icon: Compass,
    match: (p) => p.startsWith('/activity'),
  },
  {
    // อยู่ในกิจกรรมไหนก็ไปหน้าผลงานของกิจกรรมนั้น ไม่ใช่กิจกรรมที่ฝังไว้ตายตัว
    href: (p) => {
      const slug = slugOf(p)
      return slug ? `/activity/${slug}/projects` : '/explore'
    },
    label: 'ผลงาน',
    Icon: PlaySquare,
    match: (p) => p.includes('/projects'),
  },
  // ยังไม่มีระบบผู้ใช้ จึงกดไม่ได้ ไม่พากลับหน้าอื่นแบบเงียบ ๆ
  { href: () => null, label: 'คุณ', Icon: User, match: () => false },
]

/** แถบล่างแบบแอปมือถือ: แตะแล้วหมึกแผ่จากจุดที่นิ้วลง ไอคอนทึบเมื่ออยู่แท็บนั้น */
function TabLink({
  tab,
  active,
  reduced,
  path,
}: {
  tab: Tab
  active: boolean
  reduced: boolean
  path: string
}) {
  const { spawn, surface } = useRipple(reduced)
  const { Icon } = tab

  const href = tab.href(path)
  const className =
    'relative flex flex-1 select-none flex-col items-center justify-center gap-1 overflow-hidden pb-[max(6px,env(safe-area-inset-bottom))] pt-2 text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary'

  if (!href) {
    return (
      <span aria-disabled="true" title={COMING_SOON} className={`${className} opacity-45`}>
        <Icon size={22} strokeWidth={1.8} className="text-[#94A0AD]" aria-hidden="true" />
        <span className="text-[#94A0AD]">{tab.label}</span>
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onPointerDown={spawn}
      draggable={false}
      className="relative flex flex-1 select-none flex-col items-center justify-center gap-1 overflow-hidden pb-[max(6px,env(safe-area-inset-bottom))] pt-2 text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    >
      <motion.span
        aria-hidden="true"
        className="block"
        animate={{ scale: 1 }}
        whileTap={reduced ? {} : { scale: 0.9 }}
        transition={{ duration: 0.14, ease: [0.05, 0, 0, 1] }}
      >
        <Icon
          size={22}
          strokeWidth={active ? 2.5 : 1.8}
          className={active ? 'text-white' : 'text-[#94A0AD]'}
          aria-hidden="true"
        />
      </motion.span>
      <span className={active ? 'font-semibold text-white' : 'text-[#94A0AD]'}>{tab.label}</span>
      {surface}
    </Link>
  )
}

export default function MobileTabBar() {
  const reduced = (useReducedMotion() ?? false) === true
  const path = usePathname() ?? ''

  return (
    <nav
      aria-label="แถบเมนูด้านล่าง"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#27313B] bg-[#0D1117] md:hidden"
    >
      {tabs.map((tab) => (
        <TabLink
          key={tab.label}
          tab={tab}
          active={tab.match(path)}
          reduced={reduced}
          path={path}
        />
      ))}
    </nav>
  )
}
