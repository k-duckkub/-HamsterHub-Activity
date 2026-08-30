'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { slugForSpace } from '@/data/activities'
import { featuredSpaces } from '@/data/featured'
import { heroTransition, reducedTransition } from '@/lib/motion'
import { pageEnter } from '@/lib/swipe'
import CoverTile from './CoverTile'
import SpaceIcon from './SpaceIcon'

/**
 * Explore แบบปกล้วน: 5 พื้นที่สำคัญ ไม่มีข้อความบนการ์ดและใน hero
 * ไม่มีการเลื่อน ไม่มี drag — เลือกด้วยการคลิกหรือลูกศรคีย์บอร์ด
 */
export default function ExploreCoverPage() {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const router = useRouter()
  const reduced = hydrated && reducedPreference
  const active = featuredSpaces[activeIndex] ?? featuredSpaces[0]!

  useEffect(() => setHydrated(true), [])

  // เตรียมหน้ารายละเอียดของพื้นที่ที่กำลังเลือกไว้ล่วงหน้า
  useEffect(() => {
    router.prefetch(`/activity/${slugForSpace(active.id)}`)
  }, [active.id, router])

  /** คลิกการ์ดใบไหนก็เข้าหน้ากิจกรรมนั้นทันที ไม่ต้องเลือกก่อน */
  const openActivity = useCallback(
    (index: number) => {
      if (leaving) return
      setActiveIndex(index)
      setLeaving(true)
      const slug = slugForSpace(featuredSpaces[index]!.id)
      window.setTimeout(
        () => router.push(`/activity/${slug}`),
        reduced ? 150 : pageEnter.duration * 1000 * 0.72
      )
    },
    [leaving, reduced, router]
  )

  const move = (delta: number) => {
    const last = featuredSpaces.length - 1
    setActiveIndex((current) => Math.max(0, Math.min(last, current + delta)))
  }

  const transition = reduced ? reducedTransition : heroTransition

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0D1117]">
      <section className="relative h-[100dvh] overflow-hidden">
        {/* พื้นหลังคือปกของพื้นที่ที่เลือก ขยายเต็มจอแล้วเบลอ */}
        <div className="absolute inset-0 -z-10" style={{ backgroundColor: active.background }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0 [backface-visibility:hidden]"
              initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="absolute left-1/2 top-1/2 aspect-square w-[165vw] -translate-x-1/2 -translate-y-1/2 blur-[80px] brightness-[0.55] saturate-[1.25] lg:w-[125vw]">
                <SpaceIcon position={active.iconPosition} title={active.title} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-ink/55 to-transparent" />
        </div>

        {/* ปกคมชัดของพื้นที่ที่เลือก วางกลางจอด้านบนแถวการ์ด */}
        <div className="pointer-events-none absolute inset-x-0 top-[9%] flex justify-center lg:top-[11%]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              className="w-[250px] overflow-hidden rounded-[28px] shadow-[0_36px_90px_rgba(10,26,47,0.6)] sm:w-[320px] lg:w-[380px]"
              initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
              animate={{
                opacity: 1,
                scale: leaving && !reduced ? 1.015 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <SpaceIcon position={active.iconPosition} title={active.title} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          role="listbox"
          aria-label="เลือกพื้นที่"
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
          className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2.5 px-4 pb-8 sm:gap-3.5 lg:gap-4 lg:pb-12"
        >
          {featuredSpaces.map((space, index) => (
            <CoverTile
              key={space.id}
              space={space}
              reduced={reduced}
              isActive={index === activeIndex}
              onPreview={() => setActiveIndex(index)}
              onSelect={() => openActivity(index)}
            />
          ))}
        </div>

        <p aria-live="polite" className="sr-only">
          กำลังเลือกพื้นที่ {active.title}
        </p>
        {/* ออกจากหน้า 1: พื้นหลังหรี่ลงก่อนเปลี่ยนไปหน้ารายละเอียด */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          initial={false}
          animate={{ opacity: leaving ? 0.45 : 0 }}
          transition={reduced ? reducedTransition : pageEnter}
        />
      </section>

    </div>
  )
}
