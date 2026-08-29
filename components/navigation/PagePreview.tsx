'use client'

import type { ReactNode } from 'react'
import { motion, type MotionValue } from 'framer-motion'

type PagePreviewProps = {
  x: MotionValue<string>
  children: ReactNode
}

/** หน้าปลายทางที่เรนเดอร์รออยู่ด้านหลัง เพื่อไม่ให้มีจอว่างระหว่างปัด */
export default function PagePreview({ x, children }: PagePreviewProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="swipe-layer pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0D1117]"
      style={{ x }}
    >
      {children}
    </motion.div>
  )
}
