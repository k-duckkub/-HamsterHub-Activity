'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { projectsFor } from '@/data/projects'
import type { Activity } from '@/data/activities'
import ProjectCard from '@/components/explore/ProjectCard'
import ActivityShowcase from '@/components/explore/ActivityShowcase'
import ShortsReveal from '@/components/explore/ShortsReveal'
import SubscribeFooter from '@/components/explore/SubscribeFooter'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** หน้า 3 — คลังผลงานของกิจกรรมที่เลือก (กริด → Shorts → ผลงานเด็ก → ท้ายหน้า) */
export default function ActivityProjects({ activity }: { activity: Activity }) {
  const reduced = (useReducedMotion() ?? false) === true
  const list = projectsFor(activity.space.id, 'latest')

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-9">
        <h1
          tabIndex={-1}
          className="text-[28px] font-bold leading-tight text-white sm:text-[38px]"
        >
          ผลงานจาก {activity.space.title}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3">
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
              <ProjectCard project={project} space={activity.space} reduced={reduced} />
            </motion.div>
          ))}
        </div>
      </div>

      <ShortsReveal />
      <ActivityShowcase />
      <SubscribeFooter />
    </>
  )
}
