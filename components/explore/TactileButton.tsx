'use client'

import { useState } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { softSpring, reducedTransition } from '@/lib/motion'

type TactileButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost'
}

const RAISED_SHADOW =
  '0 1px 2px rgba(10, 26, 47, 0.06), 0 10px 24px rgba(10, 26, 47, 0.16)'
const PRESSED_SHADOW =
  'inset 0 2px 5px rgba(10, 26, 47, 0.12), 0 2px 6px rgba(10, 26, 47, 0.06)'

/** ปุ่มที่ให้สัมผัสเหมือนซิลิโคนนุ่ม: กดแล้วยุบตัวและเงายุบเข้าไปข้างใน */
export default function TactileButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: TactileButtonProps) {
  const reduced = useReducedMotion() ?? false
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const skin =
    variant === 'primary'
      ? 'bg-primary text-white'
      : 'border border-line bg-white text-ink'

  // transform ชุดเดียวจากทั้ง hover และ press — ไม่ให้ scale กับ scaleX/scaleY ทับกัน
  const base = hovered && !reduced ? 1.025 : 1
  const lift = (hovered && !reduced ? -1 : 0) + (pressed && !reduced ? 2 : 0)

  return (
    <motion.button
      type="button"
      className={`relative inline-flex select-none items-center justify-center rounded-pill px-7 py-3.5 text-[15px] font-semibold tracking-tight transition-shadow duration-200 ease-out ${skin} ${className}`}
      style={{
        transformOrigin: 'center bottom',
        boxShadow: pressed ? PRESSED_SHADOW : RAISED_SHADOW,
      }}
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
      animate={{
        scaleX: pressed && !reduced ? base * 0.97 : base,
        scaleY: pressed && !reduced ? base * 0.93 : base,
        y: lift,
        opacity: pressed && reduced ? 0.9 : 1,
      }}
      transition={reduced ? reducedTransition : softSpring}
      {...props}
    >
      {children}
    </motion.button>
  )
}
