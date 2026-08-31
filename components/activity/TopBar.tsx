'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu } from 'lucide-react'
import { COMING_SOON, NAV_ITEMS, SHOWCASE_ITEM } from '@/lib/navigation'
import RippleButton from '@/components/ui/RippleButton'
import MobileMenu from '@/components/navigation/MobileMenu'

const iconButton =
  'grid h-9 w-9 place-items-center text-[#94A0AD] hover:bg-white/[0.08] hover:text-white'

/** แถบบนสุด — โลโก้ เมนูหลัก และปุ่ม Project Showcase */
export default function TopBar() {
  const reduced = (useReducedMotion() ?? false) === true
  const router = useRouter()
  const path = usePathname() ?? ''
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // หน้ากิจกรรมทั้งหมดนับเป็นเมนู Activity
  const activeLabel = path.startsWith('/activity') ? 'Activity' : ''

  return (
    <header
      className="sticky top-0 z-30 border-b border-[#27313B] bg-[#0D1117]/95 backdrop-blur-[6px]"
      style={{ fontFamily: 'var(--font-brand)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <RippleButton
          ref={menuButtonRef}
          reduced={reduced}
          aria-label="เปิดเมนู"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
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
          {NAV_ITEMS.map((item) => {
            const active = item.label === activeLabel
            if (!item.href) {
              return (
                <span
                  key={item.label}
                  aria-disabled="true"
                  title={COMING_SOON}
                  className="cursor-default text-[15px] font-medium text-[#687482]"
                >
                  {item.label}
                </span>
              )
            }

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
          <RippleButton
            reduced={reduced}
            aria-label="ไปหน้ารวมผลงาน"
            onClick={() => router.push(SHOWCASE_ITEM.href ?? '/projects')}
            className="hidden items-center gap-1.5 bg-primary px-4 py-2.5 text-[14px] font-bold text-white hover:brightness-110 sm:flex"
          >
            {SHOWCASE_ITEM.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </RippleButton>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusTo={menuButtonRef}
      />
    </header>
  )
}
