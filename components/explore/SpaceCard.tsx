'use client'

import { memo } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { Space } from '@/data/spaces'
import { softSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

type SpaceCardProps = {
  space: Space
  /** ตำแหน่งเสมือนของการ์ดในแถว (ซ้ำได้หลายรอบเพื่อทำ loop) */
  slot: number
  step: number
  width: number
  x: MotionValue<number>
  isActive: boolean
  reduced: boolean
  onSelect: (slot: number) => void
}

function SpaceCardBase({
  space,
  slot,
  step,
  width,
  x,
  isActive,
  reduced,
  onSelect,
}: SpaceCardProps) {
  // ระยะจากกึ่งกลางจอของการ์ดใบนี้ (px) — ใช้ MotionValue ล้วน ไม่ setState ทุกเฟรม
  const offset = useTransform(x, (v) => v + slot * step)
  const proximityOpacity = useTransform(
    offset,
    [-2.4 * step, 0, 2.4 * step],
    [0.7, 1, 0.7],
    { clamp: true }
  )

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isActive}
      aria-label={space.title}
      tabIndex={-1}
      onClick={() => onSelect(slot)}
      className="absolute left-1/2 top-0 rounded-card border border-line bg-white p-4 text-center will-change-transform"
      style={{
        width,
        // ตำแหน่งคงที่ในแถว ส่วนการเลื่อนทั้งแถวเป็นหน้าที่ของ container
        marginLeft: slot * step - width / 2,
        opacity: reduced ? 1 : proximityOpacity,
      }}
      animate={{
        scale: isActive ? 1.06 : 0.94,
        y: isActive ? -6 : 0,
        boxShadow: isActive
          ? '0 2px 4px rgba(10, 26, 47, 0.06), 0 14px 36px rgba(10, 26, 47, 0.14)'
          : '0 1px 2px rgba(10, 26, 47, 0.05), 0 8px 24px rgba(10, 26, 47, 0.08)',
        borderColor: isActive ? '#FF6B00' : '#D9D9D9',
      }}
      whileHover={reduced || isActive ? undefined : { y: -4, scale: 0.955 }}
      whileTap={reduced ? undefined : { scaleX: 0.97, scaleY: 0.93, y: 2 }}
      transition={reduced ? reducedTransition : softSpring}
    >
      <span className="pointer-events-none mx-auto block w-[68%] overflow-hidden rounded-[12px]">
        <SpaceIcon position={space.iconPosition} title={space.title} />
      </span>
      <span
        className={[
          'mt-3 block truncate text-[14px] font-semibold tracking-tight',
          isActive ? 'text-ink' : 'text-body',
        ].join(' ')}
      >
        {space.title}
      </span>
    </motion.button>
  )
}

export default memo(SpaceCardBase)
