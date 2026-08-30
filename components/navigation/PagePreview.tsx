'use client'

import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'

type PagePreviewProps = {
  x: MotionValue<number>
  /** ตำแหน่งจริงของหน้าปัจจุบัน ใช้ตัดสินว่ากำลังปัดอยู่หรือไม่ */
  pageX: MotionValue<number>
  children: ReactNode
}

/** หน้าปลายทางที่เรนเดอร์รออยู่ด้านหลัง เพื่อไม่ให้มีจอว่างระหว่างปัด */
export default function PagePreview({ x, pageX, children }: PagePreviewProps) {
  // อยู่นิ่ง = ซ่อนไว้ กันไม่ให้โผล่ทะลุใต้หน้าปัจจุบันตอนเลื่อนอ่าน
  const visibility = useTransform(pageX, (value) =>
    Math.abs(value) > 0.5 ? 'visible' : 'hidden'
  )

  return (
    <motion.div
      aria-hidden="true"
      className="swipe-layer pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0D1117]"
      style={{ x, visibility }}
    >
      {children}
    </motion.div>
  )
}
