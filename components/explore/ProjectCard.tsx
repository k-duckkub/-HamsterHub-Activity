'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Send } from 'lucide-react'
import { creatorSlug } from '@/data/creators'
import { usePersistentLike } from '@/hooks/usePersistentLike'
import { useToast } from '@/components/ui/Toast'
import { SHARE_MESSAGE, shareLink } from '@/lib/share'
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

/** ปกชั่วคราวของผลงาน สร้างจากคู่สีของงานชิ้นนั้น */
function CoverArt({ project }: { project: Project }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background: `radial-gradient(120% 120% at 70% 20%, ${project.tint[0]} 0%, ${project.tint[1]} 72%), radial-gradient(60% 80% at 18% 22%, ${project.tint[0]}cc 0%, transparent 62%)`,
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 60% at 82% 76%, #ffffff1f 0%, transparent 60%)',
        }}
      />
    </span>
  )
}

type CoverWrapperProps = {
  href?: string
  className: string
  'aria-label': string
  onClick: (event: React.MouseEvent) => void
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
      <Link href={href} draggable={false} {...props}>
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

const DOUBLE_TAP_MS = 220

function ProjectCardBase({ project, space, reduced, href }: ProjectCardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { liked, toggle: toggleLike } = usePersistentLike('project', project.id)
  const toast = useToast()
  /** ครั้งที่ของหัวใจกลางปก เปลี่ยนค่าทุกครั้งที่ดับเบิลคลิกเพื่อเล่นอนิเมชันใหม่ */
  const [burst, setBurst] = useState(0)
  const openTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (openTimer.current) window.clearTimeout(openTimer.current)
    },
    []
  )

  /**
   * คลิกเดียวเปิดผลงาน สองครั้งคือกดใจแบบ IG
   * จึงต้องรอสั้น ๆ ก่อนเปิด เผื่อคลิกที่สองตามมา
   */
  const onCoverClick = (event: React.MouseEvent) => {
    if (!href) return
    event.preventDefault()

    if (openTimer.current) {
      window.clearTimeout(openTimer.current)
      openTimer.current = null
      if (!liked) toggleLike()
      setBurst((value) => value + 1)
      return
    }

    openTimer.current = window.setTimeout(() => {
      openTimer.current = null
      router.push(href)
    }, DOUBLE_TAP_MS)
  }
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
          onClick={onCoverClick}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={`เล่น ${project.title} โดย ${project.creator}`}
          className="relative z-10 -mx-5 block w-[calc(100%+40px)] cursor-pointer overflow-hidden rounded-none shadow-[0_1px_2px_rgba(0,0,0,0.18)] sm:mx-0 sm:w-full sm:rounded-[18px] sm:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_4px_10px_rgba(0,0,0,0.24),0_18px_45px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="block aspect-video w-full overflow-hidden">
            <motion.span
              className="relative block h-full w-full bg-[#0D1117]"
              animate={{ scale: moves ? 1.035 : 1 }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
            >
              <span className="absolute inset-0 block">
                <CoverArt project={project} />
              </span>

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

          {/* หัวใจกลางปกตอนดับเบิลคลิก: โตพรวดแล้วจางหายแบบ IG */}
          <AnimatePresence>
            {burst > 0 && (
              <motion.span
                key={burst}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={
                  reduced
                    ? { opacity: [0, 1, 1, 0], scale: 1 }
                    : { opacity: [0, 1, 1, 0], scale: [0.2, 1.25, 1, 1.05] }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 1, times: [0, 0.18, 0.62, 1], ease: 'easeOut' }}
                onAnimationComplete={() => setBurst(0)}
              >
                <Heart
                  size={96}
                  className="text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
                  fill="currentColor"
                  strokeWidth={1}
                />
              </motion.span>
            )}
          </AnimatePresence>

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
          {/* มือถืออ่านบรรทัดเดียวเหมือนแอป จอใหญ่ยังแยกชื่อผู้สร้างขึ้นบรรทัดของตัวเอง */}
          <p className="mt-1 truncate text-[13px] text-[#94A0AD] transition-colors duration-200 group-hover:text-white sm:text-[14px]">
            <Link
              href={`/creators/${creatorSlug(project.creator)}`}
              onClick={(event) => event.stopPropagation()}
              className="rounded-[4px] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {project.creator}
            </Link>
            <span className="sm:hidden">
              {' · '}ผู้รับชม {project.viewers} คน ·{' '}
              <time dateTime={`P${project.daysAgo}D`}>{project.daysAgo} วันที่แล้ว</time>
            </span>
          </p>
          <p className="mt-0.5 hidden text-[13px] text-[#687482] sm:block">
            ผู้รับชม {project.viewers} คน ·{' '}
            <time dateTime={`P${project.daysAgo}D`}>{project.daysAgo} วันที่แล้ว</time>
          </p>
        </div>

        {/* ถูกใจกับแชร์ประจำการ์ด */}
        <div className="flex shrink-0 items-start gap-1">
          <button
            type="button"
            aria-label={liked ? `เลิกถูกใจ ${project.title}` : `ถูกใจ ${project.title}`}
            aria-pressed={liked}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              toggleLike()
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-[#94A0AD] transition-colors duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <motion.span
              initial={false}
              animate={reduced ? {} : { scale: liked ? [1, 0.82, 1.28, 0.94, 1.06, 1] : 1 }}
              transition={
                liked && !reduced
                  ? { duration: 0.62, times: [0, 0.13, 0.36, 0.58, 0.78, 1], ease: 'easeOut' }
                  : { duration: 0.2 }
              }
              className="inline-flex"
            >
              <Heart
                size={18}
                aria-hidden="true"
                className={liked ? 'text-primary' : undefined}
                fill={liked ? 'currentColor' : 'none'}
              />
            </motion.span>
          </button>

          <button
            type="button"
            aria-label={`แชร์ ${project.title}`}
            onClick={async (event) => {
              // ปุ่มอยู่ในการ์ดที่กดแล้วเปิดผลงาน จึงต้องกันไม่ให้เหตุการณ์ไหลต่อ
              event.preventDefault()
              event.stopPropagation()
              if (!href) return
              const message = SHARE_MESSAGE[await shareLink({ title: project.title, path: href })]
              if (message) toast.show(message)
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-[#94A0AD] transition-colors duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Send size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(ProjectCardBase)
