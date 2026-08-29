'use client'

import { memo, useState } from 'react'
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
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  // ระยะจากกึ่งกลางจอของการ์ดใบนี้ (px) — ใช้ MotionValue ล้วน ไม่ setState ทุกเฟรม
  const offset = useTransform(x, (v) => v + slot * step)
  const proximityOpacity = useTransform(
    offset,
    [-2.4 * step, 0, 2.4 * step],
    [0.7, 1, 0.7],
    { clamp: true }
  )

  // คำนวณ transform ทั้งหมดเป็นชุดเดียว: active + hover + press
  // ถ้าปล่อยให้ animate ใช้ scale แล้ว whileTap ใช้ scaleX/scaleY จะเขียนทับกันจนกระตุก
  const base = isActive ? 1.06 : hovered ? 0.955 : 0.94
  const lift = (isActive ? -6 : hovered ? -4 : 0) + (pressed ? 2 : 0)

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isActive}
      aria-label={space.title}
      tabIndex={-1}
      onClick={() => onSelect(slot)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => {
        setPressed(false)
        setHovered(false)
      }}
      onPointerEnter={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={[
        'absolute left-1/2 top-0 rounded-card border bg-white p-4 text-center',
        'transition-[box-shadow,border-color] duration-300 ease-out',
        isActive ? 'border-primary shadow-card-active' : 'border-line shadow-card',
      ].join(' ')}
      style={{
        width,
        // ตำแหน่งคงที่ในแถว ส่วนการเลื่อนทั้งแถวเป็นหน้าที่ของ container
        marginLeft: slot * step - width / 2,
        opacity: reduced ? 1 : proximityOpacity,
        transformOrigin: 'center bottom',
      }}
      animate={{
        scaleX: pressed && !reduced ? base * 0.97 : base,
        scaleY: pressed && !reduced ? base * 0.93 : base,
        y: reduced ? (isActive ? -6 : 0) : lift,
      }}
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
