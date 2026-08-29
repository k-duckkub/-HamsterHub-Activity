'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion'
import type { Space } from '@/data/spaces'
import { softSpring, reducedTransition } from '@/lib/motion'
import SpaceCard from './SpaceCard'

/** จำนวนชุดที่ clone ไว้รอบชุดจริง เพื่อให้เลื่อนวนได้แบบไร้รอยต่อ */
const REPEAT = 5
const CENTER_SET = 2

type Metrics = { width: number; gap: number }

function useMetrics(): Metrics {
  const [metrics, setMetrics] = useState<Metrics>({ width: 168, gap: 22 })

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)')
    const apply = () =>
      setMetrics(query.matches ? { width: 168, gap: 22 } : { width: 132, gap: 16 })
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return metrics
}

type SpaceCarouselProps = {
  spaces: Space[]
  activeIndex: number
  onChange: (index: number) => void
}

export default function SpaceCarousel({
  spaces,
  activeIndex,
  onChange,
}: SpaceCarouselProps) {
  const reduced = useReducedMotion() ?? false
  const { width, gap } = useMetrics()
  const step = width + gap
  const count = spaces.length

  // slot = ตำแหน่งเสมือนของการ์ดที่อยู่ตรงกลาง (เลื่อนต่อไปได้เรื่อย ๆ ทั้งสองทิศ)
  const [slot, setSlot] = useState(activeIndex)
  const slotRef = useRef(activeIndex)
  const x = useMotionValue(-activeIndex * step)
  const wheelLock = useRef(0)
  const railRef = useRef<HTMLDivElement>(null)

  // ปรับตำแหน่งเมื่อขนาดการ์ดเปลี่ยน (breakpoint) โดยไม่ให้กระโดด
  useEffect(() => {
    x.set(-slotRef.current * step)
  }, [step, x])

  const goToSlot = useCallback(
    (target: number, instant = false) => {
      // target ผ่าน rebase มาแล้ว จึงอยู่ในช่วงของชุดกลางเสมอ
      slotRef.current = target
      setSlot(target)
      onChange(((target % count) + count) % count)
      if (instant) {
        x.set(-target * step)
        return
      }
      animate(x, -target * step, reduced ? reducedTransition : softSpring)
    },
    [count, onChange, reduced, step, x]
  )

  /** ดึง slot กลับเข้าชุดกลาง เพื่อให้ clone มีพอเสมอ ผู้ใช้จะไม่เห็นการกระโดด */
  const rebase = useCallback(
    (slot: number) => {
      if (slot >= count) {
        x.set(x.get() + count * step)
        return slot - count
      }
      if (slot < 0) {
        x.set(x.get() - count * step)
        return slot + count
      }
      return slot
    },
    [count, step, x]
  )

  const move = useCallback(
    (delta: number) => {
      goToSlot(rebase(slotRef.current + delta))
    },
    [goToSlot, rebase]
  )

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const projected = x.get() + info.velocity.x * 0.12
      goToSlot(rebase(Math.round(-projected / step)))
    },
    [goToSlot, rebase, step, x]
  )

  // wheel/trackpad แนวนอน — ผูกเองเพื่อ preventDefault ได้ (React onWheel เป็น passive)
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : 0
      if (!delta) return
      event.preventDefault()
      const now = Date.now()
      if (now - wheelLock.current < 260) return
      wheelLock.current = now
      move(delta > 0 ? 1 : -1)
    }

    rail.addEventListener('wheel', onWheel, { passive: false })
    return () => rail.removeEventListener('wheel', onWheel)
  }, [move])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
  }

  const cards = Array.from({ length: REPEAT * count }, (_, i) => {
    const cardSlot = i - CENTER_SET * count
    const space = spaces[((cardSlot % count) + count) % count] as Space
    return { slot: cardSlot, space }
  })

  return (
    <div className="flex items-center justify-center gap-4 px-3 sm:gap-6">
      <ArrowButton
        direction="prev"
        reduced={reduced}
        onClick={() => move(-1)}
      />

      <div
        ref={railRef}
        role="listbox"
        aria-label="เลือกพื้นที่"
        aria-orientation="horizontal"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative h-[212px] w-full max-w-[860px] overflow-hidden sm:h-[236px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%)',
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-6 h-full cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {cards.map(({ slot: cardSlot, space }) => (
            <SpaceCard
              key={`${space.id}-${cardSlot}`}
              space={space}
              slot={cardSlot}
              step={step}
              width={width}
              x={x}
              reduced={reduced}
              isActive={cardSlot === slot}
              onSelect={(target) => goToSlot(rebase(target))}
            />
          ))}
        </motion.div>
      </div>

      <ArrowButton direction="next" reduced={reduced} onClick={() => move(1)} />
    </div>
  )
}

function ArrowButton({
  direction,
  onClick,
  reduced,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  reduced: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'พื้นที่ก่อนหน้า' : 'พื้นที่ถัดไป'}
      whileHover={reduced ? undefined : { scale: 1.05, y: -1 }}
      whileTap={reduced ? undefined : { scaleX: 0.95, scaleY: 0.9, y: 2 }}
      transition={reduced ? reducedTransition : softSpring}
      className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:border-primary hover:text-primary focus-ring-light sm:grid"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === 'prev' ? <path d="M14.5 5 8 12l6.5 7" /> : <path d="M9.5 5 16 12l-6.5 7" />}
      </svg>
    </motion.button>
  )
}
