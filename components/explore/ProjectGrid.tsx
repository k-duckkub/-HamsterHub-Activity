'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectsFor } from '@/data/projects'
import type { Space } from '@/data/spaces'
import ProjectCard from './ProjectCard'

const EASE_OUT = [0.22, 1, 0.36, 1] as const
/** ผลงานของพื้นที่ที่เลือกอยู่ — หน้าที่สองเมื่อเลื่อนลงมาจากตัวเลือกด้านบน */
export default function ProjectGrid({ space }: { space: Space }) {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference
  const list = projectsFor(space.id, 'latest')

  useEffect(() => setHydrated(true), [])

  const reveal = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: reduced
      ? { duration: 0.15 }
      : { duration: 0.55, ease: EASE_OUT, delay },
  })

  return (
    <section className="bg-[#0D1117]">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-14 sm:px-9 sm:pt-14">
        <div className="border-b border-[#27313B] pb-6">
          <motion.h2
            {...reveal(0)}
            className="text-[32px] font-bold leading-tight text-white sm:text-[42px] lg:text-[46px]"
          >
            {space.title}
          </motion.h2>
        </div>

        {/* เปลี่ยนพื้นที่ = เปลี่ยนข้อมูล ไม่ใช่ transition ยาว ๆ */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE_OUT }}
            className="mt-9 grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3"
          >
            {list.map((project, index) => (
              <motion.div
                key={project.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={
                  reduced
                    ? { duration: 0.15 }
                    : { duration: 0.55, ease: EASE_OUT, delay: index * 0.045 }
                }
              >
                <ProjectCard project={project} space={space} reduced={reduced} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
