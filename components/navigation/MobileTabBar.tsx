'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Home, PlaySquare, User } from 'lucide-react'
import { useRipple } from '@/components/ui/RippleSurface'

type Tab = {
  href: string
  label: string
  Icon: typeof Home
  /** แท็บนี้ถือว่าเลือกอยู่เมื่อ path ปัจจุบันเข้าเงื่อนไขนี้ */
  match: (path: string) => boolean
}

const tabs: Tab[] = [
  { href: '/explore', label: 'หน้าแรก', Icon: Home, match: (p) => p === '/explore' },
  {
    href: '/explore',
    label: 'กิจกรรม',
    Icon: Compass,
    match: (p) => p.startsWith('/activity'),
  },
  {
    href: '/activity/game-jam-x/projects',
    label: 'ผลงาน',
    Icon: PlaySquare,
    match: (p) => p.includes('/projects'),
  },
  { href: '/explore', label: 'คุณ', Icon: User, match: () => false },
]

/** แถบล่างแบบแอปมือถือ: แตะแล้วหมึกแผ่จากจุดที่นิ้วลง ไอคอนทึบเมื่ออยู่แท็บนั้น */
function TabLink({ tab, active, reduced }: { tab: Tab; active: boolean; reduced: boolean }) {
  const { spawn, surface } = useRipple(reduced)
  const { Icon } = tab

  return (
    <Link
      href={tab.href}
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
        <TabLink key={tab.label} tab={tab} active={tab.match(path)} reduced={reduced} />
      ))}
    </nav>
  )
}
