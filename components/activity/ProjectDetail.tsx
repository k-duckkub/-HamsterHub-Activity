'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Heart, Play, Send } from 'lucide-react'
import type { Activity } from '@/data/activities'
import type { Project } from '@/data/projects'
import { siblingProjects } from '@/data/projects'
import { motionTokens } from '@/lib/motion'
import ProjectCard from '@/components/explore/ProjectCard'
import SpaceIcon from '@/components/explore/SpaceIcon'
import RippleButton from '@/components/ui/RippleButton'
import ActionPill from './ActionPill'

export default function ProjectDetail({
  project,
  activity,
}: {
  project: Project
  activity: Activity
}) {
  const reduced = (useReducedMotion() ?? false) === true
  const [liked, setLiked] = useState(false)
  const others = siblingProjects(project)

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...motionTokens.content, duration: 0.38, delay: reduced ? 0 : delay },
  })

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-6 sm:px-8">
      <Link
        href={`/activity/${activity.slug}/projects`}
        className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-[14px] text-[#94A0AD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        ผลงานทั้งหมดจาก {activity.space.title}
      </Link>

      {/* ปกผลงาน ใช้คู่สีเดียวกับการ์ดในกริด */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.38 }}
        className="relative mt-4 grid aspect-video w-full place-items-center overflow-hidden rounded-[18px]"
        style={{
          background: `radial-gradient(120% 120% at 70% 20%, ${project.tint[0]} 0%, ${project.tint[1]} 72%)`,
        }}
      >
        {/* ยังไม่มีภาพผลงานจริง ใช้ไอคอนของกิจกรรมบนพื้นไล่สีของผลงานไปก่อน */}
        <span className="block w-[22%] min-w-[110px] overflow-hidden rounded-[16px] opacity-95 ring-1 ring-white/15">
          <SpaceIcon
            position={activity.space.iconPosition}
            title={activity.space.title}
          />
        </span>
      </motion.div>

      <motion.h1
        {...enter(0.06)}
        tabIndex={-1}
        className="mt-6 text-[26px] font-bold leading-tight text-white outline-none sm:text-[34px]"
      >
        {project.title}
      </motion.h1>

      <motion.div
        {...enter(0.1)}
        className="mt-5 flex flex-wrap items-center gap-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <ActionPill
            label="ถูกใจ"
            tooltip="ถูกใจ"
            active={liked}
            reduced={reduced}
            onClick={() => setLiked((value) => !value)}
          >
            {/* จังหวะเดียวกับหัวใจบนหน้ากิจกรรม: ยุบก่อน เด้งเกินตัว แล้วนิ่ง */}
            <span className="relative inline-flex">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
                initial={false}
                animate={
                  liked && !reduced
                    ? { scale: [0.7, 2.1], opacity: [0.55, 0] }
                    : { scale: 0.7, opacity: 0 }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                initial={false}
                animate={reduced ? {} : { scale: liked ? [1, 0.82, 1.28, 0.94, 1.06, 1] : 1 }}
                transition={
                  liked && !reduced
                    ? { duration: 0.62, times: [0, 0.13, 0.36, 0.58, 0.78, 1], ease: 'easeOut' }
                    : motionTokens.softSpring
                }
                className="inline-flex"
              >
                <Heart
                  size={17}
                  aria-hidden="true"
                  className={liked ? 'text-primary' : undefined}
                  fill={liked ? 'currentColor' : 'none'}
                />
              </motion.span>
            </span>
            ถูกใจ
          </ActionPill>
          <ActionPill label="แชร์" tooltip="แชร์" flashTooltip="คัดลอกลิงก์แล้ว" reduced={reduced}>
            <Send size={17} aria-hidden="true" />
            แชร์
          </ActionPill>
        </div>
      </motion.div>

      <motion.div
        {...enter(0.14)}
        className="mt-6 rounded-[14px] bg-white/[0.055] p-5"
      >
        <p className="text-[15px] leading-relaxed text-[#C7CFD8]">
          ผลงานจาก {activity.space.title} โดย {project.creator} ส่งเข้าร่วมเมื่อ{' '}
          {project.daysAgo} วันที่แล้ว
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#C7CFD8]">
          {activity.space.description}
        </p>

        <RippleButton
          reduced={reduced}
          className="mt-5 inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-[15px] font-semibold text-white hover:brightness-[1.08]"
        >
          <Play size={17} aria-hidden="true" fill="currentColor" />
          เล่นเลย
        </RippleButton>
      </motion.div>

      {others.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[18px] font-semibold text-white">
            ผลงานอื่นจาก {activity.space.title}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-[34px] md:grid-cols-2 xl:grid-cols-3">
            {others.map((item) => (
              <ProjectCard
                key={item.id}
                project={item}
                space={activity.space}
                reduced={reduced}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
