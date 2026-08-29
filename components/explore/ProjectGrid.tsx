'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectsFor, type SortKey } from '@/data/projects'
import type { Space } from '@/data/spaces'
import ProjectCard from './ProjectCard'

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'latest', label: 'ล่าสุด' },
  { key: 'popular', label: 'ยอดนิยม' },
]

/** ผลงานของพื้นที่ที่เลือกอยู่ — หน้าที่สองเมื่อเลื่อนลงมาจากตัวเลือกด้านบน */
export default function ProjectGrid({ space }: { space: Space }) {
  const reduced = useReducedMotion() ?? false
  const [sort, setSort] = useState<SortKey>('latest')
  const list = projectsFor(space.id, sort)

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
        <div className="flex flex-col gap-6 border-b border-[#27313B] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div {...reveal(0)}>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary">
              {space.title}
            </p>
            <h2 className="mt-3 text-[32px] font-bold leading-tight text-white sm:text-[42px] lg:text-[46px]">
              ผลงานจาก {space.title}
            </h2>
            <p className="mt-3 max-w-[560px] text-[16px] text-[#94A0AD]">
              สำรวจเกมที่ทุกคนสร้างขึ้น แล้วเลือกโลกที่คุณอยากเข้าไปเล่น
            </p>
          </motion.div>

          <motion.div
            {...reveal(reduced ? 0 : 0.06)}
            role="tablist"
            aria-label="เรียงผลงาน"
            className="flex shrink-0 gap-6"
          >
            {SORTS.map(({ key, label }) => {
              const isActive = key === sort
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSort(key)}
                  className={[
                    'relative pb-2 text-[15px] transition-colors',
                    isActive ? 'font-semibold text-white' : 'text-[#687482] hover:text-[#94A0AD]',
                  ].join(' ')}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="sort-underline"
                      className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-primary"
                      transition={reduced ? { duration: 0.15 } : { duration: 0.35, ease: EASE_OUT }}
                    />
                  )}
                </button>
              )
            })}
          </motion.div>
        </div>

        {/* เปลี่ยนพื้นที่หรือเปลี่ยนการเรียง = เปลี่ยนข้อมูล ไม่ใช่ transition ยาว ๆ */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${space.id}-${sort}`}
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
