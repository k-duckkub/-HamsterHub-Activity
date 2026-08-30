'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Bookmark, Menu, Search, Share2, User } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

const iconButton =
  'grid h-9 w-9 place-items-center text-[#94A0AD] hover:bg-white/[0.08] hover:text-white'

/** เมนูหลักของเว็บ — Activity คือหน้าที่กำลังทำอยู่ */
const NAV = [
  { label: 'Home', href: '/explore' },
  { label: 'Course', href: '/explore' },
  { label: 'HamStore', href: '/explore' },
  { label: 'Activity', href: '/explore' },
  { label: 'Profile', href: '/explore' },
  { label: 'About', href: '/explore' },
]

/** แถบบนสุด — โลโก้ เมนูหลัก และปุ่ม Project Showcase */
export default function TopBar() {
  const reduced = (useReducedMotion() ?? false) === true
  const path = usePathname() ?? ''
  // หน้ากิจกรรมทั้งหมดนับเป็นเมนู Activity
  const activeLabel = path.startsWith('/activity') ? 'Activity' : ''

  return (
    <header className="sticky top-0 z-30 border-b border-[#27313B] bg-[#0D1117]/95 backdrop-blur-[6px]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <RippleButton
          reduced={reduced}
          aria-label="เมนู"
          className={`${iconButton} lg:hidden`}
        >
          <Menu size={20} aria-hidden="true" />
        </RippleButton>

        <Link
          href="/explore"
          className="shrink-0 rounded-[6px] text-[17px] font-extrabold tracking-[0.14em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          HAMSTER <span className="text-primary">HUB</span>
        </Link>

        <nav aria-label="เมนูหลัก" className="mx-auto hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active = item.label === activeLabel
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative rounded-[6px] pb-1.5 text-[15px] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
                  active ? 'text-primary' : 'text-[#C7CFD8] hover:text-white',
                ].join(' ')}
              >
                {item.label}
                {/* ขีดใต้เมนูที่อยู่ */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 block h-[2px] rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <RippleButton reduced={reduced} aria-label="ค้นหา" className={iconButton}>
            <Search size={19} aria-hidden="true" />
          </RippleButton>
          <RippleButton
            reduced={reduced}
            aria-label="แชร์หน้านี้"
            className={`${iconButton} hidden sm:grid`}
          >
            <Share2 size={19} aria-hidden="true" />
          </RippleButton>
          <RippleButton
            reduced={reduced}
            aria-label="บันทึกไว้ดูภายหลัง"
            className={`${iconButton} hidden sm:grid`}
          >
            <Bookmark size={19} aria-hidden="true" />
          </RippleButton>
          <RippleButton reduced={reduced} aria-label="บัญชีของฉัน" className={iconButton}>
            <User size={19} aria-hidden="true" />
          </RippleButton>

          <RippleButton
            reduced={reduced}
            aria-label="ไปหน้ารวมผลงาน"
            className="ml-2 hidden items-center gap-1.5 bg-primary px-4 py-2.5 text-[14px] font-bold text-white hover:brightness-110 sm:flex"
          >
            Project Showcase
            <ArrowUpRight size={16} aria-hidden="true" />
          </RippleButton>
        </div>
      </div>
    </header>
  )
}
