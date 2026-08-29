import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { t } from './motion'

const HomeIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" />
  </svg>
)
const CompassIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15 9-2 4-4 2 2-4z" />
  </svg>
)
const CalendarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3.5v4M16 3.5v4M4 10h16M9.5 14.5l1.8 1.8 3.2-3.4" />
  </svg>
)
const ChatIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A1.5 1.5 0 0 1 4 14.5z" />
  </svg>
)
const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M5 20c1.2-3.6 3.8-5.4 7-5.4s5.8 1.8 7 5.4" />
  </svg>
)

const NAV = [
  { id: 'home', label: 'หน้าหลัก', Icon: HomeIcon },
  { id: 'explore', label: 'สำรวจ', Icon: CompassIcon },
  { id: 'activity', label: 'กิจกรรม', Icon: CalendarIcon },
  { id: 'messages', label: 'ข้อความ', Icon: ChatIcon },
  { id: 'profile', label: 'โปรไฟล์', Icon: UserIcon },
]

function HamsterLogo() {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-line">
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#F6D8C8" />
        <circle cx="12.5" cy="12" r="5" fill="#C98B5E" />
        <circle cx="27.5" cy="12" r="5" fill="#C98B5E" />
        <ellipse cx="20" cy="22" rx="12.5" ry="11.5" fill="#E8B888" />
        <ellipse cx="20" cy="26" rx="8" ry="6.5" fill="#FBEBD8" />
        <circle cx="15" cy="20" r="2" fill="#0A1A2F" />
        <circle cx="25" cy="20" r="2" fill="#0A1A2F" />
        <circle cx="15.7" cy="19.3" r="0.7" fill="#fff" />
        <circle cx="25.7" cy="19.3" r="0.7" fill="#fff" />
        <ellipse cx="20" cy="24" rx="1.9" ry="1.4" fill="#FF6B00" />
        <path d="M20 25.6v1.6M20 27.2c-1.2 1.2-3 .6-3-.8M20 27.2c1.2 1.2 3 .6 3-.8" stroke="#0A1A2F" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function Sidebar({ active = 'explore', onSelect = () => {} }) {
  const reduced = useReducedMotion()

  return (
    <aside className="flex shrink-0 flex-col border-line bg-warm px-4 py-3 lg:w-[210px] lg:border-r lg:px-5 lg:py-8">
      <div className="hidden items-center gap-3 lg:flex">
        <HamsterLogo />
        <span className="hidden text-[19px] font-extrabold tracking-tight lg:inline">
          <span className="text-ink">Hamster</span>
          <span className="text-primary">Hub</span>
        </span>
      </div>

      <nav aria-label="เมนูหลัก" className="lg:mt-14">
        <ul className="flex flex-row justify-between gap-1 lg:flex-col lg:gap-1.5">
          {NAV.map(({ id, label, Icon }) => {
            const isActive = id === active
            return (
              <li key={id} className="flex-1 lg:flex-none">
                <motion.button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelect(id)}
                  whileHover={reduced ? {} : { scale: 1.02, y: -1 }}
                  whileTap={reduced ? {} : { scaleX: 0.98, scaleY: 0.94, y: 1 }}
                  transition={t(reduced)}
                  className={[
                    'flex w-full flex-col items-center gap-1 rounded-pill px-2 py-2.5 text-[13px] font-medium lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-[15px]',
                    isActive
                      ? 'bg-surface text-primary'
                      : 'text-body hover:bg-white/70',
                  ].join(' ')}
                >
                  <Icon
                    className="h-[22px] w-[22px] shrink-0"
                    stroke={isActive ? '#FF6B00' : '#5A6B7A'}
                  />
                  <span className="truncate">{label}</span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto hidden pt-8 text-[12px] leading-relaxed text-body/70 lg:block">
        พื้นที่ของครีเอเตอร์ตัวจิ๋ว
        <br />
        ที่ฝันใหญ่
      </div>
    </aside>
  )
}
