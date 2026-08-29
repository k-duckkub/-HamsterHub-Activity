'use client'

import { useState } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { buttonSpring, reducedTransition } from '@/lib/motion'

type TactileButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost'
}

/**
 * ปุ่มวัสดุจริง: กดแล้วยุบลงเล็กน้อยแบบไม่เสียรูป (สเกลเท่ากันทั้งสองแกน)
 * เงาสลับด้วย class ไม่ animate ต่อเฟรม
 */
export default function TactileButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: TactileButtonProps) {
  const reduced = useReducedMotion() ?? false
  const [pressed, setPressed] = useState(false)

  const skin =
    variant === 'primary'
      ? 'bg-primary text-white'
      : 'border border-line bg-white text-ink'

  return (
    <motion.button
      type="button"
      className={[
        'relative inline-flex select-none items-center justify-center rounded-pill px-7 py-3.5 text-[15px] font-semibold tracking-tight',
        'transition-shadow duration-200 ease-out [backface-visibility:hidden]',
        pressed
          ? 'shadow-[inset_0_1px_3px_rgba(10,26,47,0.14),0_1px_3px_rgba(10,26,47,0.08)]'
          : 'shadow-[0_1px_2px_rgba(10,26,47,0.06),0_10px_24px_rgba(10,26,47,0.16)]',
        skin,
        className,
      ].join(' ')}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      whileHover={reduced ? undefined : { scale: 1.012, y: -1 }}
      whileFocus={reduced ? undefined : { scale: 1.012, y: -1 }}
      whileTap={reduced ? { opacity: 0.9 } : { scale: 0.985, y: 1 }}
      transition={reduced ? reducedTransition : buttonSpring}
      {...props}
    >
      {children}
    </motion.button>
  )
}
