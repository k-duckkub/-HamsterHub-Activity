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
import { reducedTransition } from '@/lib/motion'
import CoverTile from './CoverTile'

/** สปริงของ carousel หน้าแรก — หนัก ไม่เด้ง */
const carouselSpring = {
  type: 'spring',
  stiffness: 135,
  damping: 24,
  mass: 1.05,
  restDelta: 0.5,
  restSpeed: 0.5,
} as const

/** ชุด clone รอบชุดจริง เพื่อให้เลื่อนวนได้ทั้งสองทางแบบไม่มีจุดตัน */
const REPEAT = 3
const CENTER_SET = 1

/** ลากเกินเท่านี้ถือว่าเป็นการปัด ไม่ใช่การคลิกการ์ด */
const CLICK_SLOP = 6
const VELOCITY_FACTOR = 0.1
const WHEEL_COOLDOWN = 380
const WHEEL_THRESHOLD = 48

export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length
}

type Metrics = {
  /** ความกว้างการ์ดที่อยู่ตรงกลาง ใช้คิด threshold ของการปัด */
  active: number
  /** ระยะห่างระหว่างจุดกึ่งกลางของการ์ดสองใบที่ติดกัน */
  step: number
}

function useMetrics(): Metrics {
  const [metrics, setMetrics] = useState<Metrics>({ active: 196, step: 176 })

  useEffect(() => {
    const large = window.matchMedia('(min-width: 1024px)')
    const small = window.matchMedia('(min-width: 640px)')
    const apply = () => {
      // step แคบกว่าความกว้างการ์ด active เล็กน้อย แถวจึงกระชับเหมือนเดิม
      if (large.matches) setMetrics({ active: 196, step: 176 })
      else if (small.matches) setMetrics({ active: 152, step: 138 })
      else setMetrics({ active: 86, step: 78 })
    }
    apply()
    large.addEventListener('change', apply)
    small.addEventListener('change', apply)
    return () => {
      large.removeEventListener('change', apply)
      small.removeEventListener('change', apply)
    }
  }, [])

  return metrics
}

type ExploreCarouselProps = {
  spaces: Space[]
  activeIndex: number
  reduced: boolean
  /** เรียกหลัง snap เข้าที่แล้วเท่านั้น ภาพใหญ่กับพื้นหลังจึงเปลี่ยนตาม */
  onCommit: (index: number) => void
  /** กดการ์ดที่อยู่ตรงกลางอยู่แล้ว = เปิดหน้ารายละเอียด */
  onOpenActive: (index: number) => void
}

/**
 * Carousel ของหน้าแรก — เลื่อนได้ทั้งสองทิศ วนไม่มีที่สิ้นสุด
 * ไม่มีการเปลี่ยน route จากการลาก การปัด wheel หรือปุ่มลูกศรใด ๆ
 */
export default function ExploreCarousel({
  spaces,
  activeIndex,
  reduced,
  onCommit,
  onOpenActive,
}: ExploreCarouselProps) {
  const reducedPreference = useReducedMotion() ?? false
  const { active, step } = useMetrics()
  const count = spaces.length

  const [slot, setSlot] = useState(activeIndex)
  const slotRef = useRef(activeIndex)
  const x = useMotionValue(-activeIndex * step)
  const draggedRef = useRef(false)
  const wheelStamp = useRef(0)
  const wheelAcc = useRef(0)
  const railRef = useRef<HTMLDivElement>(null)

  const noMotion = reduced || reducedPreference

  useEffect(() => {
    x.set(-slotRef.current * step)
  }, [step, x])

  /** ดึง slot กลับเข้าชุดกลางพร้อมชดเชย x ในเฟรมเดียว ผู้ใช้จึงไม่เห็นการกระโดด */
  const rebase = useCallback(
    (target: number) => {
      if (target >= count) {
        x.set(x.get() + count * step)
        return target - count
      }
      if (target < 0) {
        x.set(x.get() - count * step)
        return target + count
      }
      return target
    },
    [count, step, x]
  )

  const goToSlot = useCallback(
    (raw: number) => {
      const target = rebase(raw)
      slotRef.current = target
      setSlot(target)

      const controls = animate(
        x,
        -target * step,
        noMotion ? reducedTransition : carouselSpring
      )
      // ภาพใหญ่และพื้นหลังเปลี่ยนหลัง snap จบเท่านั้น
      void controls.then(() => onCommit(wrapIndex(target, count)))
    },
    [count, noMotion, onCommit, rebase, step, x]
  )

  const move = useCallback((delta: number) => goToSlot(slotRef.current + delta), [goToSlot])

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const threshold = active * 0.18
      const projectedOffset = info.offset.x + info.velocity.x * VELOCITY_FACTOR

      // ลาก track ไปซ้าย (offset ติดลบ) = ไปกิจกรรมถัดไป
      let direction = 0
      if (projectedOffset < -threshold) direction = 1
      if (projectedOffset > threshold) direction = -1

      goToSlot(slotRef.current + direction)
      window.setTimeout(() => {
        draggedRef.current = false
      }, 0)
    },
    [active, goToSlot]
  )

  // wheel/trackpad แนวนอน — ไม่เปลี่ยน route ทำแค่เลื่อน carousel
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()

      const now = Date.now()
      if (now - wheelStamp.current < WHEEL_COOLDOWN) return
      wheelAcc.current += Math.max(-40, Math.min(40, event.deltaX))
      if (Math.abs(wheelAcc.current) < WHEEL_THRESHOLD) return

      const direction = wheelAcc.current > 0 ? 1 : -1
      wheelAcc.current = 0
      wheelStamp.current = now
      move(direction)
    }

    rail.addEventListener('wheel', onWheel, { passive: false })
    return () => rail.removeEventListener('wheel', onWheel)
  }, [move])

  const cards = Array.from({ length: REPEAT * count }, (_, index) => {
    const cardSlot = index - CENTER_SET * count
    const space = spaces[wrapIndex(cardSlot, count)] as Space
    return { slot: cardSlot, space }
  })

  return (
    <div
      ref={railRef}
      role="listbox"
      aria-label="เลือกกิจกรรม"
      aria-orientation="horizontal"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
      }}
      className="absolute inset-x-0 bottom-0 h-[132px] pb-8 sm:h-[210px] lg:h-[250px] lg:pb-12"
    >
      {/* หน้าต่างกว้าง 5 ช่อง ใบที่เกินจากนั้นถูกตัดออก แถวจึงเห็นห้าใบเท่าเดิม */}
      <div
        className="relative mx-auto h-full max-w-full overflow-hidden"
        style={{ width: step * 5 }}
      >
      <motion.div
        className="carousel-track absolute inset-x-0 bottom-8 top-0 cursor-grab active:cursor-grabbing lg:bottom-12"
        style={{ x }}
        drag="x"
        dragElastic={0.035}
        dragMomentum={false}
        dragConstraints={{ left: -step, right: step }}
        onDragStart={() => {
          draggedRef.current = false
        }}
        onDrag={(_event, info) => {
          if (Math.abs(info.offset.x) > CLICK_SLOP) draggedRef.current = true
        }}
        onDragEnd={handleDragEnd}
      >
        {cards.map(({ slot: cardSlot, space }) => {
          const isActive = cardSlot === slot
          return (
            <div
              key={`${space.id}-${cardSlot}`}
              // ช่องกว้างเท่ากันทุกใบ การ์ดจัดกลางในช่องของตัวเอง
              className="absolute bottom-0 left-1/2 flex items-end justify-center"
              style={{ width: step, marginLeft: cardSlot * step - step / 2 }}
            >
              <CoverTile
                space={space}
                reduced={noMotion}
                isActive={isActive}
                onSelect={() => {
                  if (draggedRef.current) return
                  if (isActive) onOpenActive(wrapIndex(cardSlot, count))
                  else goToSlot(cardSlot)
                }}
              />
            </div>
          )
        })}
      </motion.div>
      </div>
    </div>
  )
}
