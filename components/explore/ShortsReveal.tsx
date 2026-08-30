'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { projects } from '@/data/projects'
import { SHORT_SLOTS } from '@/data/shorts'
import { heroTransition, reducedTransition, shortsSequenceMotion } from '@/lib/motion'
import ShortSlot from './ShortSlot'

export default function ShortsReveal() {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const [forceFullMotion, setForceFullMotion] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const rowRef = useRef<HTMLDivElement | null>(null)
  const reduced = hydrated && reducedPreference && !forceFullMotion

  // เลื่อนมาถึงแถวการ์ด = ดึงคันโยกหนึ่งครั้ง ยิงครั้งเดียวแล้วไม่ยิงซ้ำ
  const pulled = useInView(rowRef, {
    once: true,
    amount: shortsSequenceMotion.triggerAmount,
  })

  useEffect(() => {
    setHydrated(true)
    // ?motion=full ใช้ตรวจงานบนเครื่องที่ปิดอนิเมชันของระบบไว้
    setForceFullMotion(new URLSearchParams(window.location.search).get('motion') === 'full')
  }, [])

  const slots = SHORT_SLOTS.map((slot) => ({
    ...slot,
    project: projects.find((project) => project.id === slot.projectId),
  })).filter((slot): slot is typeof slot & { project: (typeof projects)[number] } =>
    Boolean(slot.project),
  )

  const finishReveal = (_slotIndex: number, title: string) => {
    setAnnouncement(`เปิดได้ผลงาน ${title}`)
  }

  const revealTransition = reduced ? reducedTransition : heroTransition

  return (
    <section className="border-t border-[#27313B] bg-[#0D1117]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-9 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={revealTransition}
          className="mb-8 sm:mb-10"
        >
          <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[40px]">
            เปิด Shorts ลับ
          </h2>
          <p className="mt-2 text-[15px] text-white/55 sm:text-[16px]">
            วงล้อออกตัวพร้อมกัน แล้วหยุดทีละใบ
          </p>
        </motion.div>

        {/* overflow-x: auto ทำให้แกนตั้งกลายเป็น auto ตามไปด้วย ล้อเมาส์เลยถูกแถวนี้กิน
            จอกว้างจึงปิด overflow ทิ้ง ส่วนจอเล็กที่ยังต้องปัดดูให้ล็อกเฉพาะแกนนอน */}
        <div
          ref={rowRef}
          className="grid snap-x snap-mandatory grid-flow-col auto-cols-[42vw] gap-4 overflow-x-auto overflow-y-hidden px-1 py-8 [scrollbar-width:none] sm:auto-cols-[31vw] md:auto-cols-[190px] xl:grid-flow-row xl:grid-cols-5 xl:auto-cols-auto xl:overflow-visible xl:snap-none [&::-webkit-scrollbar]:hidden"
        >
          {slots.map(({ slotIndex, project }) => (
            <div key={slotIndex} className="snap-start">
              <ShortSlot
                slotIndex={slotIndex}
                project={project}
                decoys={projects}
                locked={false}
                forceFullMotion={forceFullMotion}
                autoSpin={hydrated && pulled}
                onReveal={finishReveal}
              />
            </div>
          ))}
        </div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>
      </div>
    </section>
  )
}
