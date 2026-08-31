'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { activitiesOfCreator, projectsByCreator, type Creator } from '@/data/creators'
import { slugForSpace } from '@/data/activities'
import { spaces } from '@/data/spaces'
import ProjectCard from '@/components/explore/ProjectCard'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/**
 * หน้าโปรไฟล์ผู้สร้าง — แสดงเฉพาะสิ่งที่มีข้อมูลจริง
 * ยังไม่มียอดผู้ติดตาม ประวัติ หรือรางวัลในข้อมูล จึงไม่มีช่องเหล่านั้น
 */
export default function CreatorProfile({ creator }: { creator: Creator }) {
  const reduced = (useReducedMotion() ?? false) === true
  const works = projectsByCreator(creator.name)
  const joined = activitiesOfCreator(creator.name)

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-9">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#27313B] text-[22px] font-semibold text-white"
        >
          {creator.initial}
        </span>
        <div className="min-w-0">
          <h1 tabIndex={-1} className="text-[26px] font-bold leading-tight text-white sm:text-[34px]">
            {creator.name}
          </h1>
          <p className="mt-1 text-[14px] text-[#94A0AD]">
            {works.length} ผลงาน · เข้าร่วม {joined.length} กิจกรรม
          </p>
        </div>
      </div>

      {joined.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {joined.map((activity) => (
            <Link
              key={activity.slug}
              href={`/activity/${activity.slug}`}
              className="rounded-full bg-white/[0.055] px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.105] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {activity.space.title}
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-[18px] font-bold text-white">ผลงานทั้งหมด</h2>

      <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3">
        {works.map((project, index) => {
          const space = spaces.find((item) => item.id === project.spaceId)
          if (!space) return null
          return (
            <motion.div
              key={project.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={
                reduced ? { duration: 0.15 } : { duration: 0.5, ease: EASE_OUT, delay: index * 0.04 }
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
      </div>
    </main>
  )
}
