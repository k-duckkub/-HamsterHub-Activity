'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SHOWCASE_SLOTS } from '@/data/showcase'
import {
  cardHoverTransition,
  heroTransition,
  reducedTransition,
  skeletonMotion,
} from '@/lib/motion'

const CARD_SHADOW =
  'shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_4px_10px_rgba(0,0,0,0.24),0_18px_45px_rgba(0,0,0,0.22)]'

export default function ActivityShowcase() {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference
  const transition = reduced ? reducedTransition : heroTransition

  useEffect(() => setHydrated(true), [])
  const cardTransitionStyle = {
    transitionDuration: `${cardHoverTransition.duration}s`,
    transitionTimingFunction: `cubic-bezier(${cardHoverTransition.ease.join(',')})`,
  }
  const shimmerStyle = {
    '--showcase-duration': `${skeletonMotion.duration}s`,
    '--showcase-ease': skeletonMotion.ease,
    animationPlayState: reduced ? 'paused' : 'running',
  } as CSSProperties

  return (
    <section className="border-t border-[#27313B] bg-[#0D1117]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-9 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={transition}
          className="mb-9"
        >
          <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[40px]">เวทีของนักสร้างรุ่นใหม่</h2>
          <p className="mt-2 text-[15px] text-white/55 sm:text-[16px]">พื้นที่โชว์ผลงานจากทุก activity ของ HamsterHub</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3">
          {SHOWCASE_SLOTS.map((slot) => (
            <motion.article
              key={slot.slotIndex}
              aria-label={`ช่องแสดงผลงานที่ ${slot.slotIndex + 1} ยังว่าง`}
              whileHover={reduced ? undefined : { y: -4, scale: 1.012 }}
              transition={reduced ? reducedTransition : cardHoverTransition}
              className={`overflow-hidden rounded-[18px] border border-[#27313B] bg-gradient-to-br from-[#161D26] to-[#0D1117] ${CARD_SHADOW}`}
              style={cardTransitionStyle}
            >
              <div aria-hidden="true" className="relative aspect-video overflow-hidden">
                <div className="showcase-shimmer absolute inset-0" style={shimmerStyle} />
                <div className="absolute inset-x-4 bottom-4 flex items-end gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-white/[0.07]" />
                  <span className="flex-1 space-y-2 pb-0.5">
                    <span className="block h-2.5 w-3/4 rounded-full bg-white/[0.08]" />
                    <span className="block h-2 w-2/5 rounded-full bg-white/[0.05]" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}

          <motion.div
            role="img"
            aria-label="เพิ่มผลงาน ยังไม่เปิดใช้งาน"
            whileHover={reduced ? undefined : { y: -4, scale: 1.012 }}
            transition={reduced ? reducedTransition : cardHoverTransition}
            className={`grid aspect-video place-items-center rounded-[18px] border border-dashed border-[#33404E] bg-[#161D26]/35 ${CARD_SHADOW}`}
            style={cardTransitionStyle}
          >
            <span className="flex items-center gap-2 text-[15px] font-semibold text-white/45">
              <span aria-hidden="true" className="text-[24px] font-light leading-none text-primary">+</span>
              เพิ่มผลงาน
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
