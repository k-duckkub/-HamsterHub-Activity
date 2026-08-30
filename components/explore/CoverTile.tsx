'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Space } from '@/data/spaces'
import { cardSpring, PREVIEW_INTENT_MS, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

type CoverTileProps = {
  space: Space
  isActive: boolean
  reduced: boolean
  /** คลิกครั้งเดียวเข้าหน้ากิจกรรมทันที */
  onSelect: () => void
  /** ชี้เมาส์หรือโฟกัสค้าง = พรีวิวกิจกรรมนี้ (พื้นหลังกับปกใหญ่เปลี่ยนตาม) */
  onPreview: () => void
}

/** การ์ดปกอย่างเดียว ไม่มีข้อความใด ๆ ชื่อพื้นที่อยู่ใน aria-label เพื่อการเข้าถึง */
function CoverTileBase({
  space,
  isActive,
  reduced,
  onSelect,
  onPreview,
}: CoverTileProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const intent = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (intent.current) window.clearTimeout(intent.current)
    },
    []
  )

  const base = isActive ? 1 : hovered ? 0.96 : 0.93
  const scale = pressed && !reduced ? base * 0.985 : base
  const lift = (isActive ? -10 : hovered ? -4 : 0) + (pressed ? 2 : 0)

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isActive}
      aria-label={space.title}
      onClick={onSelect}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerEnter={() => {
        setHovered(true)
        // การ์ดตอบสนองทันที แต่พื้นหลังรอให้แน่ใจว่าตั้งใจชี้ใบนี้จริง
        intent.current = window.setTimeout(onPreview, PREVIEW_INTENT_MS)
      }}
      onPointerLeave={() => {
        if (intent.current) window.clearTimeout(intent.current)
        setPressed(false)
        setHovered(false)
      }}
      onFocus={() => {
        setHovered(true)
        onPreview()
      }}
      onBlur={() => setHovered(false)}
      className={[
        'space-card relative shrink-0 overflow-hidden rounded-[20px] border bg-white',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        'transition-[box-shadow,border-color] duration-300 ease-out',
        isActive
          ? 'w-[86px] border-primary shadow-[0_18px_40px_rgba(10,26,47,0.32)] sm:w-[152px] lg:w-[196px]'
          : 'w-[58px] border-white/25 shadow-[0_10px_28px_rgba(10,26,47,0.24)] sm:w-[112px] lg:w-[142px]',
      ].join(' ')}
      animate={{
        scale: reduced ? 1 : scale,
        y: reduced ? 0 : lift,
        opacity: isActive ? 1 : 0.78,
      }}
      transition={reduced ? reducedTransition : cardSpring}
    >
      <SpaceIcon position={space.iconPosition} title={space.title} />
    </motion.button>
  )
}

export default memo(CoverTileBase)
