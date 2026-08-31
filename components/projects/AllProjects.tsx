'use client'

import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/data/projects'
import { activities, slugForSpace } from '@/data/activities'
import { spaces } from '@/data/spaces'
import ProjectCard from '@/components/explore/ProjectCard'
import ProjectSortBar, { parseSort } from './ProjectSortBar'
import ProjectEmptyState from './ProjectEmptyState'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** หน้ารวมผลงานจากทุกกิจกรรม — ปลายทางของปุ่ม Project Showcase */
export default function AllProjects() {
  const reduced = (useReducedMotion() ?? false) === true
  const sort = parseSort(useSearchParams()?.get('sort') ?? null)

  const list = [...projects].sort((a, b) =>
    sort === 'popular' ? b.views - a.views : a.daysAgo - b.daysAgo
  )

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-9">
      <h1 tabIndex={-1} className="text-[28px] font-bold leading-tight text-white sm:text-[38px]">
        ผลงานทั้งหมด
      </h1>
      <p className="mt-2 text-[14px] text-[#94A0AD]">{list.length} ผลงานจากทุกกิจกรรม</p>

      <div className="mt-6">
        <ProjectSortBar sort={sort} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3">
        {list.map((project, index) => {
          const space = spaces.find((item) => item.id === project.spaceId)
          const activity = activities.find((item) => item.space.id === project.spaceId)
          if (!space || !activity) return null
          return (
            <motion.div
              key={project.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={
                reduced
                  ? { duration: 0.15 }
                  : { duration: 0.5, ease: EASE_OUT, delay: Math.min(index, 8) * 0.04 }
              }
            >
              <ProjectCard
                project={project}
                space={space}
                reduced={reduced}
                href={`/activity/${slugForSpace(project.spaceId)}/projects/${project.id}`}
              />
            </motion.div>
          )
        })}

        {list.length === 0 && <ProjectEmptyState />}
      </div>
    </main>
  )
}
