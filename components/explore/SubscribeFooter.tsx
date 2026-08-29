'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/data/projects'
import {
  buttonSpring,
  reducedTransition,
  subscribeBackdropMotion,
} from '@/lib/motion'

const COLUMN_COUNT = 6
const ITEMS_PER_COLUMN = 8

export default function SubscribeFooter() {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference
  const columnStyle = {
    '--subscribe-duration': `${subscribeBackdropMotion.duration}s`,
    '--subscribe-ease': subscribeBackdropMotion.ease,
    animationPlayState: reduced ? 'paused' : 'running',
  } as CSSProperties

  useEffect(() => setHydrated(true), [])

  return (
    <footer className="relative flex min-h-[640px] items-center justify-center overflow-hidden border-t border-[#27313B] bg-[#0D1117] px-5 py-24 sm:min-h-[700px] sm:px-9">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-6 opacity-[0.22]">
        {Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => {
          const items = Array.from({ length: ITEMS_PER_COLUMN }, (_, rowIndex) =>
            projects[(columnIndex + rowIndex * COLUMN_COUNT) % projects.length],
          ).filter((project): project is (typeof projects)[number] => Boolean(project))
          const duplicated = [...items, ...items]

          return (
            <div key={columnIndex} className="overflow-hidden">
              <div
                className={columnIndex % 2 === 0 ? 'subscribe-column-up' : 'subscribe-column-down'}
                style={columnStyle}
              >
                {duplicated.map((project, itemIndex) => (
                  <div key={`${project.id}-${itemIndex}`} className="p-1 sm:p-1.5">
                    <div
                      className="aspect-[9/16] rounded-[18px] border border-[#27313B]"
                      style={{
                        background: `radial-gradient(120% 90% at 50% 18%, ${project.tint[0]} 0%, ${project.tint[1]} 78%)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,17,23,0.38)_0%,rgba(13,17,23,0.9)_56%,#0D1117_88%)]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="text-[38px] font-bold leading-tight text-white sm:text-[54px]">Thanks for watching</h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-[17px]">
          ติดตามเรื่องราวและผลงานใหม่จากนักสร้างของ HamsterHub
        </p>
        <motion.button
          type="button"
          whileHover={reduced ? undefined : { y: -3, scale: 1.012 }}
          whileTap={reduced ? undefined : { y: 1, scale: 0.988 }}
          transition={reduced ? reducedTransition : buttonSpring}
          className="mt-8 rounded-pill bg-primary px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_32px_rgba(255,107,0,0.24)]"
        >
          Subscribe Now
        </motion.button>
      </div>
    </footer>
  )
}
