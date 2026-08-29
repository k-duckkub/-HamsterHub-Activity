import React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Scene } from '../data/spaces.jsx'
import TactileButton from './TactileButton'
import { GENTLE_SPRING } from './motion'

export default function Hero({ space }) {
  const reduced = useReducedMotion()

  const bgTransition = reduced
    ? { duration: 0.2, ease: 'easeOut' }
    : { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }

  const textTransition = reduced ? { duration: 0.18, ease: 'easeOut' } : GENTLE_SPRING

  return (
    <div className="absolute inset-0 isolate overflow-hidden">
      {/* ชั้นพื้นหลัง: ภาพเก่ากับภาพใหม่ซ้อนกันเพื่อ crossfade ต่อเนื่อง */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={space.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={bgTransition}
          >
            <Scene {...space.scene} />
          </motion.div>
        </AnimatePresence>

        {/* overlay น้ำเงินเข้มโปร่งใส ให้ตัวอักษรอ่านง่าย */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(10,26,47,0.92) 0%, rgba(10,26,47,0.72) 38%, rgba(10,26,47,0.34) 68%, rgba(10,26,47,0.5) 100%)',
          }}
        />
      </div>

      <div className="flex h-full flex-col justify-center px-6 pb-[280px] pt-10 sm:px-10 lg:px-14 lg:pb-[300px] lg:pt-16">
        <div className="max-w-[560px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -10 }}
              transition={textTransition}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#7FD6D8]">
                {space.category}
              </p>
              <h1 className="mt-4 text-[44px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[60px] lg:text-[74px]">
                {space.title}
              </h1>
              <p className="mt-4 max-w-[420px] text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
                {space.subtitle}
              </p>
              <p className="mt-5 text-[14px] text-white/60">
                ผู้รับชม{' '}
                <span className="font-semibold text-white">{space.viewers}</span> คน
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <TactileButton
              className="focus-ring-light"
              aria-label={`เข้าสู่พื้นที่ ${space.title}`}
            >
              เข้าสู่พื้นที่
            </TactileButton>
          </div>
        </div>
      </div>
    </div>
  )
}
