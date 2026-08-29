'use client'

import { useLayoutEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Space } from '@/data/spaces'
import { heroTransition, heroTextTransition, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'
import TactileButton from './TactileButton'

gsap.registerPlugin(ScrollTrigger)

export default function ExploreHero({ space }: { space: Space }) {
  const reduced = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  // GSAP แตะเฉพาะ wrapper ของพื้นหลังที่ผูกกับ page scroll เท่านั้น
  // ไม่แตะ carousel, การ์ด, CTA หรือ motion.div ใด ๆ
  useLayoutEffect(() => {
    if (reduced) return
    const context = gsap.context(() => {
      gsap.to(parallaxRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  const bgTransition = reduced ? reducedTransition : heroTransition
  const textTransition = reduced ? reducedTransition : heroTextTransition

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
      {/* GSAP คุม wrapper — Framer Motion คุมลูกข้างใน */}
      <div ref={parallaxRef} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={space.id}
            className="absolute inset-0 [backface-visibility:hidden]"
            style={{
              // สีพื้น + radial gradient จาก accent อยู่ในเลเยอร์เดียวกัน
              // จึง crossfade ด้วย opacity อย่างเดียว ไม่ต้อง animate blur
              backgroundColor: space.background,
              backgroundImage: `radial-gradient(120% 95% at 80% 18%, ${space.accent}59 0%, ${space.accent}00 58%), radial-gradient(90% 80% at 12% 88%, ${space.accent}26 0%, ${space.accent}00 60%)`,
            }}
            initial={{ opacity: 0, scale: reduced ? 1 : 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={bgTransition}
          />
        </AnimatePresence>

        {/* วงกลมเบลอคงที่ ไม่เปลี่ยนค่าเวลาสลับพื้นที่ (blur ไม่ถูก animate เลย) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-[-18%] h-[520px] w-[520px] rounded-full bg-white/10 blur-[90px]" />
          <div className="absolute -bottom-40 right-[26%] h-[420px] w-[420px] rounded-full bg-white/[0.07] blur-[100px]" />
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(10,26,47,0.94) 0%, rgba(10,26,47,0.74) 40%, rgba(10,26,47,0.28) 72%, rgba(10,26,47,0.5) 100%)',
        }}
      />

      {/* ไอคอนใหญ่ของพื้นที่ที่กำลังเลือก ใช้ sprite sheet ชุดเดียวกับการ์ด */}
      <div className="pointer-events-none absolute right-[4%] top-1/2 hidden w-[420px] max-w-[38vw] -translate-y-[58%] lg:block xl:w-[500px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={space.id}
            initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
            animate={{ opacity: 0.92, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={bgTransition}
            className="overflow-hidden rounded-[28px] drop-shadow-[0_24px_60px_rgba(10,26,47,0.45)] [backface-visibility:hidden]"
          >
            <SpaceIcon position={space.iconPosition} title={space.title} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex h-full flex-col justify-center px-6 pb-[290px] pt-10 sm:px-10 lg:px-14 lg:pb-[320px] lg:pt-16">
        <div className="max-w-[560px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -4 }}
              transition={textTransition}
            >
              <p
                className="text-[13px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: space.accent === '#FF6B00' ? '#FFB682' : '#7FD6D8' }}
              >
                {space.category}
              </p>
              <h1 className="mt-4 text-[38px] font-extrabold leading-[1.06] tracking-tight text-white sm:text-[54px] lg:text-[64px]">
                {space.title}
              </h1>
              <p className="mt-4 max-w-[430px] text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
                {space.description}
              </p>
              <p className="mt-5 text-[14px] text-white/60">
                ผู้รับชม <span className="font-semibold text-white">{space.viewers}</span> คน
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <TactileButton className="focus-ring-light">เข้าสู่พื้นที่</TactileButton>
          </div>
        </div>
      </div>
    </div>
  )
}
