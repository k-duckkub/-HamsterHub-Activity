'use client'

import { useEffect, useState } from 'react'

/** เส้นบางที่ขอบซ้าย บอกว่ามีหน้าผลงานรออยู่ด้านหลัง */
export default function SwipeEdgeHint({ visible }: { visible: boolean }) {
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!visible) return
    const onMove = (event: PointerEvent) => setNear(event.clientX < 64)
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [visible])

  if (!visible) return null

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-30 transition-[width] duration-300 ease-out"
      style={{
        width: near ? 8 : 4,
        background:
          'linear-gradient(90deg, rgba(255, 107, 0, 0.22), transparent)',
      }}
    />
  )
}
