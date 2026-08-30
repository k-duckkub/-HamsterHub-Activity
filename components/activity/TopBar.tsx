'use client'

import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { Bookmark, Menu, Search, Share2, User } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

const iconButton =
  'grid h-9 w-9 place-items-center text-[#94A0AD] hover:bg-white/[0.08] hover:text-white'

/** แถบบนสุดของหน้ากิจกรรม — เมนู โลโก้ ช่องค้นหา และปุ่มด้านขวา */
export default function TopBar() {
  const reduced = (useReducedMotion() ?? false) === true

  return (
    <header className="sticky top-0 z-30 border-b border-[#27313B] bg-[#0D1117]/95 backdrop-blur-[6px]">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <RippleButton reduced={reduced} aria-label="เมนู" className={iconButton}>
          <Menu size={20} aria-hidden="true" />
        </RippleButton>

        <Link
          href="/explore"
          className="rounded-[6px] text-[16px] font-extrabold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Hamster<span className="text-primary">Hub</span>
        </Link>

        <div className="mx-auto hidden w-full max-w-[440px] items-center gap-2 rounded-full border border-[#27313B] bg-[#151B22] px-4 py-2 sm:flex">
          <Search size={16} className="shrink-0 text-[#687482]" aria-hidden="true" />
          <input
            type="search"
            placeholder="ค้นหากิจกรรม"
            aria-label="ค้นหากิจกรรม"
            className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#687482]"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <RippleButton reduced={reduced} aria-label="แชร์หน้านี้" className={iconButton}>
            <Share2 size={19} aria-hidden="true" />
          </RippleButton>
          <RippleButton reduced={reduced} aria-label="บันทึกไว้ดูภายหลัง" className={iconButton}>
            <Bookmark size={19} aria-hidden="true" />
          </RippleButton>
          <RippleButton reduced={reduced} aria-label="บัญชีของฉัน" className={iconButton}>
            <User size={19} aria-hidden="true" />
          </RippleButton>
        </div>
      </div>
    </header>
  )
}
