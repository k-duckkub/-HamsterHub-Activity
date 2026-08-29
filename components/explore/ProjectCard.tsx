'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import type { Space } from '@/data/spaces'
import { buttonSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type ProjectCardProps = {
  project: Project
  space: Space
  reduced: boolean
}

function ProjectCardBase({ project, space, reduced }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  // ลายปกต่างกันตามผลงาน จะได้ไม่ซ้ำกันทั้งกริด
  const variant = project.id.charCodeAt(project.id.length - 1) % 3

  const hoverMotion = reduced
    ? {}
    : { y: hovered ? -4 : 0, scale: pressed ? 0.988 : hovered ? 1.012 : 1 }

  return (
    <motion.article
      className="group"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      animate={{ ...hoverMotion, y: (hoverMotion.y ?? 0) + (pressed ? 1 : 0) }}
      transition={
        reduced
          ? reducedTransition
          : pressed
            ? buttonSpring
            : { duration: 0.38, ease: EASE_OUT }
      }
    >
      <button
        type="button"
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`เล่น ${project.title} โดย ${project.creator}`}
        className="relative block w-full cursor-pointer overflow-hidden rounded-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_4px_10px_rgba(0,0,0,0.24),0_18px_45px_rgba(0,0,0,0.22)]"
      >
        <span className="block aspect-video w-full overflow-hidden">
          <motion.span
            className="relative block h-full w-full"
            style={{
              background: `radial-gradient(120% 120% at 70% 20%, ${project.tint[0]} 0%, ${project.tint[1]} 72%)`,
            }}
            animate={{ scale: reduced ? 1 : hovered ? 1.035 : 1 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          >
            {/* ยังไม่มีภาพผลงานจริง: ปกชั่วคราวสร้างจากคู่สีของผลงาน
                บวกไอคอนของพื้นที่เป็นตราเล็ก ๆ มุมล่าง */}
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `radial-gradient(60% 80% at ${18 + variant * 28}% ${variant === 1 ? 78 : 22}%, ${project.tint[0]}cc 0%, transparent 62%), radial-gradient(45% 60% at ${82 - variant * 18}% ${variant === 2 ? 20 : 76}%, #ffffff1f 0%, transparent 60%)`,
              }}
            />
            <span className="absolute bottom-3 left-3 block w-[64px] overflow-hidden rounded-[12px] ring-1 ring-white/15 sm:w-[72px]">
              <SpaceIcon position={space.iconPosition} title={space.title} />
            </span>
          </motion.span>
        </span>

        <motion.span
          aria-hidden="true"
          className="absolute inset-0 bg-black/20"
          animate={{ opacity: reduced ? 1 : hovered ? 0.5 : 1 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        />

      </button>

      <div className="mt-3 flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[14px] font-semibold text-white"
          style={{ backgroundColor: project.tint[0] }}
        >
          {project.initial}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-white">
            {project.title}
          </h3>
          <p className="mt-1 truncate text-[14px] text-[#94A0AD]">{project.creator}</p>
          <p className="mt-0.5 text-[13px] text-[#687482]">
            ผู้รับชม {project.viewers} คน · {project.daysAgo} วันที่แล้ว
          </p>
        </div>

        <button
          type="button"
          aria-label={`ตัวเลือกเพิ่มเติมของ ${project.title}`}
          className="h-8 w-8 shrink-0 rounded-full text-[#687482] transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}

export default memo(ProjectCardBase)
