'use client'

import { useLayoutEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Space } from '@/data/spaces'
import { softSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'
import TactileButton from './TactileButton'

gsap.registerPlugin(ScrollTrigger)

export default function ExploreHero({ space }: { space: Space }) {
  const reduced = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // GSAP คุมเฉพาะ wrapper ของพื้นหลัง/ของตกแต่งที่ผูกกับ page scroll เท่านั้น
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
      gsap.to(glowRef.current, {
        yPercent: -6,
        scale: 1.06,
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

  const crossfade = reduced
    ? reducedTransition
    : { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const }

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
      {/* ชั้นพื้นหลัง: GSAP คุม wrapper, Framer Motion คุมลูกข้างใน */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <AnimatePresence initial={false}>
          <motion.div
            key={space.id}
            className="absolute inset-0"
            style={{ backgroundColor: space.background }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
          />
        </AnimatePresence>
      </div>

      <div ref={glowRef} className="absolute inset-0 will-change-transform">
        <AnimatePresence initial={false}>
          <motion.div
            key={space.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
          >
            <div
              className="absolute -right-24 top-[-18%] h-[560px] w-[560px] rounded-full blur-[120px]"
              style={{ backgroundColor: space.accent, opacity: 0.34 }}
            />
            <div
              className="absolute left-[8%] top-[38%] h-[420px] w-[420px] rounded-full blur-[130px]"
              style={{ backgroundColor: space.accent, opacity: 0.14 }}
            />
            <div className="absolute -bottom-40 right-[26%] h-[460px] w-[460px] rounded-full bg-white/10 blur-[140px]" />
          </motion.div>
        </AnimatePresence>
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
            transition={reduced ? reducedTransition : { ...softSpring, duration: 0.7 }}
            className="overflow-hidden rounded-[28px] drop-shadow-[0_24px_60px_rgba(10,26,47,0.45)]"
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
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -10 }}
              transition={reduced ? reducedTransition : { ...softSpring, stiffness: 210 }}
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
