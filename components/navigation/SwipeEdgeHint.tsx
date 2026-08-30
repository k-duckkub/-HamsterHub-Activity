'use client'

import { useEffect, useState } from 'react'

/** เส้นบางที่ขอบจอ บอกว่ามีอีกหน้ารออยู่ทางนั้น */
export default function SwipeEdgeHint({
  visible,
  side = 'left',
}: {
  visible: boolean
  side?: 'left' | 'right'
}) {
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!visible) return
    const onMove = (event: PointerEvent) =>
      setNear(
        side === 'left'
          ? event.clientX < 64
          : event.clientX > window.innerWidth - 64
      )
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [side, visible])

  if (!visible) return null

  return (
    <span
      aria-hidden="true"
      className={[
        'pointer-events-none fixed inset-y-0 z-30 transition-[width] duration-300 ease-out',
        side === 'left' ? 'left-0' : 'right-0',
      ].join(' ')}
      style={{
        width: near ? 8 : 4,
        background:
          side === 'left'
            ? 'linear-gradient(90deg, rgba(255, 107, 0, 0.22), transparent)'
            : 'linear-gradient(270deg, rgba(255, 107, 0, 0.22), transparent)',
      }}
    />
  )
}
