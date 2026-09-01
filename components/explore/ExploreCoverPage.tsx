'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { featuredActivities } from '@/data/featured'
import { coverSwapTransition, pageEnter, reducedTransition } from '@/lib/motion'
import { requestIntro, shouldPlayIntro } from '@/lib/activityIntro'
import { useActivityIntro } from '@/components/transitions/useActivityIntro'

import CoverTile from './CoverTile'
import ActivityArt from './ActivityArt'

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
  const { preload: preloadIntro } = useActivityIntro()
  const reduced = hydrated && reducedPreference
  const active = featuredActivities[activeIndex] ?? featuredActivities[0]!

  useEffect(() => setHydrated(true), [])

  // โหลดภาพอินโทรตั้งแต่เปิดหน้า ไฟล์ใหญ่หลายเมกะไบต์ ถ้ารอตอนคลิกจะเริ่มช้า
  useEffect(() => preloadIntro(), [preloadIntro])

  // เตรียมหน้ารายละเอียดของพื้นที่ที่กำลังเลือกไว้ล่วงหน้า
  useEffect(() => {
    router.prefetch(`/activity/${active.slug}`)
  }, [active.slug, router])

  /**
   * คลิกการ์ดใบไหนก็เข้าหน้ากิจกรรมนั้นทันที ไม่ต้องเลือกก่อน
   * ครั้งแรกของ session จะเล่นอินโทรไดโนเสาร์ ถ้าไฟล์ครบและผู้ใช้ไม่ได้ปิดแอนิเมชัน
   */
  const openActivity = useCallback(
    (index: number) => {
      if (leaving) return
      setActiveIndex(index)
      setLeaving(true)
      const destination = `/activity/${featuredActivities[index]!.slug}`

      // ไม่รอผลตรวจไฟล์ตรงนี้ เพราะผู้ใช้กดได้เร็วกว่าการโหลดเสมอ
      // ถ้าไฟล์ไม่พร้อมจริง ตัว overlay จะพาไปหน้าปลายทางทันทีเอง
      if (!reduced && shouldPlayIntro()) {
        requestIntro({ destination })
        return
      }

      // ไม่มีไฟล์อินโทรหรือปิดแอนิเมชันไว้ ก็ข้ามไปด้วยการเปลี่ยนหน้าสั้น ๆ
      window.setTimeout(
        () => router.push(destination),
        reduced ? 150 : pageEnter.duration * 1000 * 0.72
      )
    },
    [leaving, reduced, router]
  )

  const move = (delta: number) => {
    const last = featuredActivities.length - 1
    setActiveIndex((current) => Math.max(0, Math.min(last, current + delta)))
  }

  const transition = reduced ? reducedTransition : coverSwapTransition

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#0D1117]">
      <section className="relative h-[100dvh] overflow-hidden">
        {/* พื้นหลังของทุกกิจกรรมถูกเรนเดอร์ค้างไว้ตั้งแต่แรก
            การสลับจึงเป็นการไล่ opacity อย่างเดียว ไม่ต้อง mount ใหม่หรือคำนวณ blur ซ้ำ */}
        <div className="absolute inset-0 -z-10 bg-[#0D1117]">
          {featuredActivities.map((activity, index) => (
            <motion.div
              key={activity.slug}
              aria-hidden="true"
              className="absolute inset-0 [backface-visibility:hidden] [contain:paint] [will-change:opacity]"
              style={{ backgroundColor: activity.space.background }}
              initial={false}
              animate={{ opacity: index === activeIndex ? 1 : 0 }}
              transition={transition}
            >
              <div className="absolute left-1/2 top-1/2 aspect-square w-[165vw] -translate-x-1/2 -translate-y-1/2 blur-[80px] brightness-[0.55] saturate-[1.25] lg:w-[125vw]">
                <ActivityArt space={activity.space} iconClassName="w-full" sizes="165vw" />
              </div>
            </motion.div>
          ))}

          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-ink/55 to-transparent" />
        </div>

        {/* ปกคมชัดก็ซ้อนไว้ทุกใบเช่นกัน สลับด้วย opacity อย่างเดียว */}
        <div className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center lg:top-[15%]">
          <div className="relative w-[300px] sm:w-[500px] lg:w-[660px]">
            {/* ตัวกำหนดความสูงของกรอบ ไม่แสดงผลเอง */}
            <div className="invisible aspect-video" />

            {featuredActivities.map((activity, index) => (
              <motion.div
                key={activity.slug}
                className="absolute inset-0 grid place-items-center overflow-hidden rounded-[28px] shadow-[0_36px_90px_rgba(10,26,47,0.6)] [backface-visibility:hidden] [will-change:opacity,transform]"
                initial={false}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  scale:
                    index === activeIndex && leaving && !reduced ? 1.015 : 1,
                }}
                transition={transition}
              >
                <ActivityArt
                  space={activity.space}
                  iconClassName="w-[62%]"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 660px"
                  priority
                />
              </motion.div>
            ))}
          </div>
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
          className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2.5 px-4 pb-[calc(84px+env(safe-area-inset-bottom))] sm:gap-3.5 sm:pb-8 lg:gap-4 lg:pb-12"
        >
          {featuredActivities.map((activity, index) => (
            <CoverTile
              key={activity.slug}
              space={activity.space}
              reduced={reduced}
              isActive={index === activeIndex}
              onPreview={() => {
                setActiveIndex(index)
                preloadIntro()
              }}
              onSelect={() => openActivity(index)}
            />
          ))}
        </div>

        <p aria-live="polite" className="sr-only">
          กำลังเลือกกิจกรรม {active.title}
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

    </main>
  )
}
