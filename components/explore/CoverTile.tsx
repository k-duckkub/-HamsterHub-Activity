'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Space } from '@/data/spaces'
import { cardSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

type CoverTileProps = {
  space: Space
  isActive: boolean
  reduced: boolean
  onSelect: () => void
}

/** การ์ดปกอย่างเดียว ไม่มีข้อความใด ๆ ชื่อพื้นที่อยู่ใน aria-label เพื่อการเข้าถึง */
function CoverTileBase({ space, isActive, reduced, onSelect }: CoverTileProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

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
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setPressed(false)
        setHovered(false)
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={[
        'space-card relative shrink-0 overflow-hidden rounded-[20px] border bg-white',
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
