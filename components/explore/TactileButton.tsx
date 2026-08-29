'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { softSpring, reducedTransition } from '@/lib/motion'

type TactileButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost'
}

/** ปุ่มที่ให้สัมผัสเหมือนซิลิโคนนุ่ม: กดแล้วยุบตัวและเงายุบเข้าไปข้างใน */
export default function TactileButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: TactileButtonProps) {
  const reduced = useReducedMotion() ?? false

  const skin =
    variant === 'primary'
      ? 'bg-primary text-white'
      : 'border border-line bg-white text-ink'

  return (
    <motion.button
      type="button"
      className={`relative inline-flex select-none items-center justify-center rounded-pill px-7 py-3.5 text-[15px] font-semibold tracking-tight ${skin} ${className}`}
      style={{
        transformOrigin: 'center bottom',
        boxShadow:
          variant === 'primary'
            ? '0 1px 2px rgba(10, 26, 47, 0.06), 0 10px 24px rgba(10, 26, 47, 0.16)'
            : '0 1px 2px rgba(10, 26, 47, 0.05)',
      }}
      whileHover={reduced ? undefined : { scale: 1.025, y: -1 }}
      whileFocus={reduced ? undefined : { scale: 1.025, y: -1 }}
      whileTap={
        reduced
          ? { opacity: 0.9 }
          : {
              scaleX: 0.97,
              scaleY: 0.93,
              y: 2,
              boxShadow:
                'inset 0 2px 5px rgba(10, 26, 47, 0.12), 0 2px 6px rgba(10, 26, 47, 0.06)',
            }
      }
      transition={reduced ? reducedTransition : softSpring}
      {...props}
    >
      {children}
    </motion.button>
  )
}
