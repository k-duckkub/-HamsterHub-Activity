'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { featuredActivities } from '@/data/featured'
import { coverSwapTransition, pageEnter, reducedTransition } from '@/lib/motion'
import { requestIntro, shouldPlayIntro } from '@/lib/activityIntro'
import { useActivityIntro } from '@/components/transitions/useActivityIntro'

import CoverTile from './CoverTile'
import ActivityCover from '@/components/activity/ActivityCover'

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
        {/* พื้นหลัง hero: โปสเตอร์ของกิจกรรมที่เลือกอยู่ เต็มพื้นที่
            ทุกใบถูกเรนเดอร์ค้างไว้ตั้งแต่แรก การสลับจึงเป็นการไล่ opacity อย่างเดียว
            ไม่ต้อง mount ใหม่ระหว่างเลื่อนการ์ด */}
        <div className="absolute inset-0 z-0 bg-[#08111D]">
          {featuredActivities.map((activity, index) => (
            <motion.div
              key={activity.slug}
              aria-hidden={index === activeIndex ? undefined : 'true'}
              className="absolute inset-0 [backface-visibility:hidden] [will-change:opacity,transform]"
              initial={false}
              animate={{
                opacity: index === activeIndex ? 1 : 0,
                scale: index === activeIndex && !reduced ? 1 : 1.025,
              }}
              transition={{
                opacity: transition,
                scale: reduced ? reducedTransition : { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <ActivityCover
                space={activity.space}
                className="h-full w-full"
                sizes="100vw"
                iconClassName="w-[30%] max-w-[280px]"
                priority={index === 0}
              />
            </motion.div>
          ))}

          {/* ไล่เฉดให้ตัวหนังสือกับแถวการ์ดอ่านออกบนภาพทุกใบ
              โปสเตอร์บางใบสว่างจัดตรงกลาง จึงต้องมีทั้งม่านบาง ๆ ทั้งใบและเฉดหนาที่ครึ่งล่าง */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#08111D] via-[#08111D]/78 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08111D]/70 via-[#08111D]/10 to-transparent" />
        </div>

        {/* ชื่อกิจกรรมที่เลือกอยู่ วางซ้ายล่างเหนือแถวการ์ด */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-[calc(200px+env(safe-area-inset-bottom))] sm:pb-[176px] md:px-12 md:pb-[206px]">
          <motion.p
            key={`${active.slug}-label`}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
          >
            {active.space.category || 'HamsterHub Activity'}
          </motion.p>

          <motion.h1
            key={`${active.slug}-title`}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.48, delay: reduced ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-[26px] font-semibold leading-tight tracking-[-0.03em] text-white md:text-[52px]"
          >
            {active.title}
          </motion.h1>

          <motion.p
            key={`${active.slug}-date`}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-[13px] text-white/70 md:text-[15px]"
          >
            {active.dateRange}
          </motion.p>
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
          className="absolute inset-x-0 bottom-0 z-30 overflow-x-auto scroll-smooth px-4 pb-[calc(84px+env(safe-area-inset-bottom))] pt-3 [scrollbar-width:none] sm:pb-8 md:px-10 lg:pb-12 [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-max items-end gap-3 md:gap-4">
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
