'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import type { Space } from '@/data/spaces'
import { buttonSpring, cardPreviewMotion, reducedTransition } from '@/lib/motion'
import SpaceIcon from './SpaceIcon'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type ProjectCardProps = {
  /** ปลายทางของการ์ด ถ้าไม่ส่งมาการ์ดจะเป็นปุ่มที่ยังไม่พาไปไหน */
  href?: string
  project: Project
  space: Space
  reduced: boolean
}

/** ปกชั่วคราวหนึ่งภาพ — เปลี่ยน frame ได้ เพื่อบอกว่าผลงานมีหลายภาพ */
function CoverArt({ project, frame }: { project: Project; frame: number }) {
  const spot = 18 + frame * 28
  const flip = frame === 1

  return (
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background: `radial-gradient(120% 120% at 70% 20%, ${project.tint[0]} 0%, ${project.tint[1]} 72%), radial-gradient(60% 80% at ${spot}% ${flip ? 78 : 22}%, ${project.tint[0]}cc 0%, transparent 62%)`,
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: `radial-gradient(45% 60% at ${82 - frame * 18}% ${frame === 2 ? 20 : 76}%, #ffffff1f 0%, transparent 60%)`,
        }}
      />
    </span>
  )
}

type CoverWrapperProps = {
  href?: string
  className: string
  'aria-label': string
  onPointerDown: () => void
  onPointerUp: () => void
  onPointerCancel: () => void
  onFocus: () => void
  onBlur: () => void
  children: React.ReactNode
}

/** ปกการ์ดเป็นลิงก์เมื่อรู้ปลายทาง ไม่งั้นคงเป็นปุ่มเหมือนเดิม */
function CoverWrapper({ href, children, ...props }: CoverWrapperProps) {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" {...props}>
      {children}
    </button>
  )
}

function ProjectCardBase({ project, space, reduced, href }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [frame, setFrame] = useState(0)
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPreview = () => {
    if (startTimer.current) clearTimeout(startTimer.current)
    if (frameTimer.current) clearInterval(frameTimer.current)
    startTimer.current = null
    frameTimer.current = null
  }

  // ชี้ค้างไว้แล้วภาพจะไล่ทีละใบเอง เหมือนพรีวิวของ YouTube
  useEffect(() => {
    if (!hovered || reduced) {
      stopPreview()
      setFrame(0)
      return
    }

    startTimer.current = setTimeout(() => {
      frameTimer.current = setInterval(() => {
        setFrame((current) => (current + 1) % cardPreviewMotion.frameCount)
      }, cardPreviewMotion.frameIntervalMs)
    }, cardPreviewMotion.startDelayMs)

    return stopPreview
  }, [hovered, reduced])

  useEffect(() => stopPreview, [])

  // ชี้เมาส์แล้วต้องมีอะไรตอบเสมอ เปิด reduced-motion แค่ตัดการเคลื่อนไหวกับสไลด์อัตโนมัติ
  const lifted = hovered
  const moves = hovered && !reduced

  return (
    <motion.article
      className="group"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      animate={
        reduced
          ? {}
          : {
              y: (moves ? cardPreviewMotion.hoverLift : 0) + (pressed ? 2 : 0),
              scale: pressed ? 0.988 : moves ? cardPreviewMotion.hoverScale : 1,
            }
      }
      transition={
        reduced ? reducedTransition : pressed ? buttonSpring : { duration: 0.38, ease: EASE_OUT }
      }
      style={{ position: 'relative' }}
    >
      {/* แผงพื้นหลังครอบทั้งการ์ดตอนชี้เมาส์ เหมือนกรอบที่ขึ้นมาบนหน้าแรกของ YouTube */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute z-0 block border border-white/[0.14] bg-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{
          inset: -cardPreviewMotion.panelPadding,
          borderRadius: cardPreviewMotion.panelRadius,
        }}
        animate={{ opacity: lifted ? 1 : 0 }}
        transition={
          reduced ? reducedTransition : { duration: cardPreviewMotion.panelDuration, ease: EASE_OUT }
        }
      />

      {/* ชั้นภาพที่ซ้อนอยู่ข้างหลัง โผล่ตอนชี้เมาส์ บอกว่าไม่ได้มีภาพเดียว */}
      <div className="relative z-10">
        {cardPreviewMotion.stackOffset.map((offset, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 aspect-video rounded-[18px] border border-white/10"
            style={{ backgroundColor: project.tint[0] }}
            animate={{
              y: lifted ? offset : 0,
              scale: lifted ? cardPreviewMotion.stackScale[index] : 1,
              opacity: lifted ? cardPreviewMotion.stackOpacity[index] : 0,
            }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.04 }}
          />
        ))}

        <CoverWrapper
          href={href}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={`เล่น ${project.title} โดย ${project.creator}`}
          className="relative z-10 block w-full cursor-pointer overflow-hidden rounded-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_4px_10px_rgba(0,0,0,0.24),0_18px_45px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="block aspect-video w-full overflow-hidden">
            <motion.span
              className="relative block h-full w-full bg-[#0D1117]"
              animate={{ scale: moves ? 1.035 : 1 }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={frame}
                  className="absolute inset-0 block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={
                    reduced ? reducedTransition : { duration: cardPreviewMotion.crossfade }
                  }
                >
                  <CoverArt project={project} frame={frame} />
                </motion.span>
              </AnimatePresence>

              <span className="absolute bottom-3 left-3 block w-[64px] overflow-hidden rounded-[12px] ring-1 ring-white/15 sm:w-[72px]">
                <SpaceIcon position={space.iconPosition} title={space.title} />
              </span>
            </motion.span>
          </span>

          <motion.span
            aria-hidden="true"
            className="absolute inset-0 bg-black/20"
            animate={{ opacity: reduced ? 1 : lifted ? 0.5 : 1 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          />

          {/* ป้ายจำนวนภาพมุมขวาล่าง ที่เดียวกับป้ายความยาวคลิปของ YouTube */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 rounded-[6px] bg-black/75 px-1.5 py-0.5 text-[12px] font-semibold tabular-nums text-white"
          >
            {lifted && !reduced
              ? `${frame + 1}/${cardPreviewMotion.frameCount}`
              : `${cardPreviewMotion.frameCount} ภาพ`}
          </span>

          {/* จุดบอกตำแหน่งภาพ ขึ้นเฉพาะตอนชี้ค้าง */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-3 bottom-0 flex gap-1"
            animate={{ opacity: lifted ? 1 : 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {Array.from({ length: cardPreviewMotion.frameCount }, (_, index) => (
              <span
                key={index}
                className={`h-[3px] flex-1 rounded-full ${
                  index === frame ? 'bg-white' : 'bg-white/25'
                }`}
              />
            ))}
          </motion.span>
        </CoverWrapper>
      </div>

      <div className="relative z-10 mt-3 flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[14px] font-semibold text-white"
          style={{ backgroundColor: project.tint[0] }}
        >
          {project.initial}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-white">
            {href ? (
              <Link
                href={href}
                className="rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-1 truncate text-[14px] text-[#94A0AD] transition-colors duration-200 group-hover:text-white">
            {project.creator}
          </p>
          <p className="mt-0.5 text-[13px] text-[#687482]">
            ผู้รับชม {project.viewers} คน ·{' '}
            <time dateTime={`P${project.daysAgo}D`}>{project.daysAgo} วันที่แล้ว</time>
          </p>
        </div>

        {/* ปุ่มตัวเลือกโผล่ตอนชี้การ์ดหรือโฟกัสด้วยคีย์บอร์ด เหมือน YouTube */}
        <button
          type="button"
          aria-label={`ตัวเลือกเพิ่มเติมของ ${project.title}`}
          className="h-8 w-8 shrink-0 rounded-full text-[#687482] opacity-0 transition-[opacity,color,background-color] duration-200 hover:bg-white/5 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
        >
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-5 w-5"
            fill="currentColor"
            aria-hidden="true"
          >
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
