'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Space } from '@/data/spaces'
import { cardSpring, PREVIEW_INTENT_MS, reducedTransition } from '@/lib/motion'
import ActivityCover from '@/components/activity/ActivityCover'

type CoverTileProps = {
  space: Space
  isActive: boolean
  reduced: boolean
  /** คลิกครั้งเดียวเข้าหน้ากิจกรรมทันที */
  onSelect: () => void
  /** ชี้เมาส์หรือโฟกัสค้าง = พรีวิวกิจกรรมนี้ (พื้นหลังเปลี่ยนตาม) */
  onPreview: () => void
}

/** การ์ดเลือกกิจกรรมใต้ hero — โปสเตอร์จริงพร้อมชื่อกิจกรรมกำกับ */
function CoverTileBase({ space, isActive, reduced, onSelect, onPreview }: CoverTileProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const intent = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (intent.current) window.clearTimeout(intent.current)
    },
    []
  )

  const base = isActive ? 1 : hovered ? 0.985 : 0.96
  const scale = pressed && !reduced ? base * 0.985 : base

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
        'space-card group relative h-[92px] w-[148px] shrink-0 overflow-hidden rounded-[18px]',
        'ring-1 ring-inset transition-[box-shadow,ring-color] duration-300 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        'md:h-[118px] md:w-[190px]',
        isActive
          ? 'ring-2 ring-primary shadow-[0_18px_40px_rgba(10,26,47,0.45)]'
          : 'ring-white/12 shadow-[0_10px_28px_rgba(10,26,47,0.3)]',
      ].join(' ')}
      animate={{ scale: reduced ? 1 : scale, opacity: isActive ? 1 : hovered ? 1 : 0.68 }}
      transition={reduced ? reducedTransition : cardSpring}
    >
      <ActivityCover
        space={space}
        className="h-full w-full"
        sizes="(max-width: 768px) 148px, 190px"
        iconClassName="w-[42%]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
      />

      <span className="absolute inset-x-3 bottom-2.5 truncate text-left text-[12px] font-medium text-white md:text-[13px]">
        {space.title}
      </span>
    </motion.button>
  )
}

export default memo(CoverTileBase)
