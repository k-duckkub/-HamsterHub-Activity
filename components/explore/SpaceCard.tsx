'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Space } from '@/data/spaces'
import { cardSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

type SpaceCardProps = {
  space: Space
  /** ตำแหน่งเสมือนของการ์ดในแถว (ซ้ำได้หลายรอบเพื่อทำ loop) */
  slot: number
  step: number
  width: number
  isActive: boolean
  reduced: boolean
  onSelect: (slot: number) => void
}

function SpaceCardBase({
  space,
  slot,
  step,
  width,
  isActive,
  reduced,
  onSelect,
}: SpaceCardProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  // transform ชุดเดียวจาก active + hover + press
  // (ถ้าให้ animate คุม scale แล้ว whileTap คุม scaleX/scaleY จะเขียนทับกันจนกระตุก)
  const base = isActive ? 1.035 : hovered ? 0.987 : 0.975
  const scale = pressed && !reduced ? base * 0.985 : base
  const lift = (isActive ? -4 : hovered ? -2 : 0) + (pressed ? 1 : 0)

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
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setPressed(false)
        setHovered(false)
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={[
        'space-card absolute left-1/2 top-0 rounded-card border bg-white p-4 text-center',
        'transition-[box-shadow,border-color] duration-300 ease-out',
        isActive
          ? 'border-primary shadow-[0_14px_32px_rgba(10,26,47,0.13)]'
          : 'border-line shadow-[0_8px_24px_rgba(10,26,47,0.08)]',
      ].join(' ')}
      style={{
        width,
        // ตำแหน่งคงที่ในแถว ส่วนการเลื่อนทั้งแถวเป็นหน้าที่ของ track
        marginLeft: slot * step - width / 2,
      }}
      animate={{
        scale: reduced ? 1 : scale,
        y: reduced ? 0 : lift,
        opacity: isActive ? 1 : 0.72,
      }}
      transition={reduced ? reducedTransition : cardSpring}
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
