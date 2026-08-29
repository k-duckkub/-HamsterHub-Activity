'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { motionTokens } from '@/lib/motion'

/** ป้ายเล็กใต้ปุ่ม ขึ้นเมื่อชี้ค้างนานพอ หรือเมื่อเพิ่งกดสำเร็จ */
export default function Tooltip({
  label,
  open,
  reduced,
}: {
  label: string
  open: boolean
  reduced: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 -translate-x-1/2 whitespace-nowrap rounded-[6px] px-2 py-1.5 text-[12px] text-white"
          style={{ background: 'rgba(40,40,40,0.96)' }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 2, scale: 0.98 }}
          transition={motionTokens.instant}
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
