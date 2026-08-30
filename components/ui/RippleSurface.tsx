'use client'

import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { motion } from 'framer-motion'

type Ripple = { id: number; x: number; y: number; size: number }

/**
 * หมึกกระจายแบบปุ่ม YouTube: วงกลมจาง ๆ แผ่จากจุดที่นิ้วแตะจนเต็มปุ่มแล้วจางหาย
 * ปุ่มไม่ขยับ ไม่ย่อ — น้ำหนักการกดมาจากพื้นหลังที่เข้มขึ้นกับหมึกวงนี้เท่านั้น
 */
export function useRipple(reduced: boolean) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const spawn = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (reduced) return
      const target = event.currentTarget
      const rect = target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      // วงต้องใหญ่พอกลบมุมที่ไกลที่สุดของปุ่ม
      const size =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y)
        )

      setRipples((current) => [...current, { id: nextId.current++, x, y, size }])
    },
    [reduced]
  )

  const surface = (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-white/25"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.28 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.52, ease: [0.05, 0, 0, 1] }}
          // เก็บกวาดทันทีที่หมึกจางหมด ไม่ให้ค้างสะสมใน DOM
          onAnimationComplete={() =>
            setRipples((current) => current.filter((item) => item.id !== ripple.id))
          }
        />
      ))}
    </>
  )

  return { spawn, surface }
}
