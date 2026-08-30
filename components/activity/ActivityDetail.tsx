'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  CircleCheck,
  Flag,
  Link2,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { activities, STATUS_LABEL, type Activity } from '@/data/activities'
import { motionTokens } from '@/lib/motion'
import SpaceIcon from '@/components/explore/SpaceIcon'
import ActionPill from './ActionPill'
import RecommendationItem from './RecommendationItem'

gsap.registerPlugin(ScrollTrigger)

const MENU_ITEMS = [
  { id: 'report', label: 'รายงานกิจกรรม', Icon: Flag },
  { id: 'copy', label: 'คัดลอกลิงก์', Icon: Link2 },
]

export default function ActivityDetail({ activity }: { activity: Activity }) {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [posterHovered, setPosterHovered] = useState(false)
  const [descriptionHovered, setDescriptionHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => setHydrated(true), [])

  // GSAP ทำแค่ sticky ของแถบกิจกรรมอื่น ไม่แตะ element ที่ Framer Motion คุมอยู่
  // GSAP ทำ scroll reveal ของ wrapper กล่องรายละเอียดเท่านั้น
  // (ตัว sticky ของแถบใช้ CSS position: sticky เพราะ GSAP pin ทำงานไม่ได้
  //  เมื่ออยู่ใต้ ancestor ที่มี transform จากเลเยอร์ปัดเปลี่ยนหน้า)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      gsap.from(descriptionRef.current, {
        y: 8,
        autoAlpha: 0,
        duration: 0.42,
        ease: 'power2.out',
        scrollTrigger: { trigger: descriptionRef.current, start: 'top 92%' },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

  // ปิดเมนูด้วย Escape หรือคลิกนอกเมนู แล้วคืนโฟกัสให้ปุ่ม
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.querySelector('button')?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (menuButtonRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    menuRef.current?.querySelector('button')?.focus()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  const others = activities.filter((item) => item.slug !== activity.slug).slice(0, 4)

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...motionTokens.content, duration: 0.38, delay: reduced ? 0 : delay },
  })

  return (
    <div ref={sectionRef} className="mx-auto max-w-[1440px] px-5 pb-24 pt-6 sm:px-8">
      <div className="mx-auto max-w-[960px]">
        <div className="min-w-0">
          {/* โปสเตอร์หลัก: ไม่ scale เพราะเป็นเนื้อหา ไม่ใช่ thumbnail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38 }}
            onPointerEnter={() => setPosterHovered(true)}
            onPointerLeave={() => setPosterHovered(false)}
            className="overflow-hidden rounded-[16px] bg-[#151B22]"
          >
            <motion.div
              initial={false}
              animate={{
                filter: posterHovered ? 'brightness(1.025)' : 'brightness(1)',
                boxShadow: posterHovered
                  ? 'inset 0 0 0 1px rgba(255,255,255,0.075)'
                  : 'inset 0 0 0 1px rgba(255,255,255,0)',
              }}
              transition={motionTokens.hover}
              className="mx-auto w-full max-w-[420px] py-6"
            >
              <SpaceIcon
                position={activity.space.iconPosition}
                title={activity.space.title}
              />
            </motion.div>
          </motion.div>

          <motion.p
            {...enter(0.06)}
            className="mt-6 text-[14px] font-medium text-primary"
          >
            {activity.space.category}
          </motion.p>

          <motion.h1
            {...enter(0.06)}
            tabIndex={-1}
            className="mt-2 text-[28px] font-bold leading-tight text-white outline-none sm:text-[36px]"
          >
            {activity.space.title}
          </motion.h1>

          <motion.div
            {...enter(0.1)}
            className="mt-5 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#27313B] text-[15px] font-semibold text-white"
              >
                {activity.organizerInitial}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-[15px] font-medium text-white">
                  {activity.organizer}
                  <BadgeCheck size={15} className="text-[#94A0AD]" aria-hidden="true" />
                </p>
                <p className="text-[13px] text-[#94A0AD]">
                  ผู้ติดตาม {activity.followers} คน
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionPill
                label="ถูกใจ"
                tooltip="ถูกใจ"
                active={liked}
                reduced={reduced}
                onClick={() => {
                  setLiked((value) => !value)
                  setDisliked(false)
                }}
              >
                <motion.span
                  initial={false}
                  animate={
                    reduced
                      ? {}
                      : { scale: liked ? [1, 1.12, 1] : 1, y: liked ? [0, -2, 0] : 0 }
                  }
                  transition={motionTokens.softSpring}
                  className="inline-flex"
                >
                  <ThumbsUp
                    size={17}
                    aria-hidden="true"
                    fill={liked ? 'currentColor' : 'none'}
                  />
                </motion.span>
                {/* ความกว้างคงที่ ตัวเลขเปลี่ยนแล้วปุ่มไม่กระโดด */}
                <span className="inline-block min-w-[64px] text-left tabular-nums">
                  {liked ? '1.1 พัน' : activity.likes}
                </span>
              </ActionPill>

              <ActionPill
                label="ไม่ถูกใจ"
                tooltip="ไม่ถูกใจ"
                active={disliked}
                reduced={reduced}
                onClick={() => {
                  setDisliked((value) => !value)
                  setLiked(false)
                }}
              >
                <ThumbsDown
                  size={17}
                  aria-hidden="true"
                  fill={disliked ? 'currentColor' : 'none'}
                />
              </ActionPill>

              <ActionPill label="แชร์" tooltip="แชร์" flashTooltip="คัดลอกลิงก์แล้ว" reduced={reduced}>
                <Share2 size={17} aria-hidden="true" />
                แชร์
              </ActionPill>

              <ActionPill
                label="บันทึก"
                tooltip="บันทึก"
                flashTooltip="บันทึกแล้ว"
                active={saved}
                reduced={reduced}
                onClick={() => setSaved((value) => !value)}
              >
                <motion.span
                  initial={false}
                  animate={reduced ? {} : { scale: saved ? [0.92, 1.08, 1] : 1 }}
                  transition={motionTokens.softSpring}
                  className="inline-flex"
                >
                  <Bookmark
                    size={17}
                    aria-hidden="true"
                    className={saved ? 'text-white' : undefined}
                    fill={saved ? 'currentColor' : 'none'}
                  />
                </motion.span>
                บันทึก
              </ActionPill>

              <div ref={menuButtonRef} className="relative">
                <ActionPill
                  label="ตัวเลือกเพิ่มเติม"
                  reduced={reduced}
                  onClick={() => setMenuOpen((value) => !value)}
                  className="px-3"
                >
                  <MoreHorizontal size={17} aria-hidden="true" />
                </ActionPill>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      ref={menuRef}
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] z-30 w-[190px] overflow-hidden rounded-[12px] border border-white/10 bg-[#1E1E1E] py-1.5"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -2 }}
                      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                      style={{ transformOrigin: 'top right' }}
                    >
                      {MENU_ITEMS.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] text-white transition-colors hover:bg-white/[0.08]"
                        >
                          <Icon size={16} aria-hidden="true" />
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* กล่องรายละเอียดแบบ YouTube — กดที่ไหนก็ขยายได้ */}
          <div ref={descriptionRef} className="mt-6">
          <motion.section
            layout
            data-no-page-swipe
            onPointerEnter={() => setDescriptionHovered(true)}
            onPointerLeave={() => setDescriptionHovered(false)}
            onClick={() => setExpanded((value) => !value)}
            animate={{
              backgroundColor:
                expanded || descriptionHovered
                  ? 'rgba(255,255,255,0.075)'
                  : 'rgba(255,255,255,0.055)',
            }}
            initial={false}
            transition={{
              layout: reduced ? { duration: 0.15 } : motionTokens.layoutSpring,
              backgroundColor: motionTokens.hover,
            }}
            className="cursor-pointer rounded-[14px] p-5"
          >
            <motion.div layout="position" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[14px] text-white">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#94A0AD]" aria-hidden="true" />
                {activity.dateRange}
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span className="flex items-center gap-2">
                <Users size={16} className="text-[#94A0AD]" aria-hidden="true" />
                {activity.teamSize}
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span>{activity.fee}</span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span>{activity.prize}</span>
            </motion.div>

            <motion.p
              layout="position"
              className="mt-4 flex items-center gap-2 text-[14px] text-white"
            >
              <CircleCheck size={16} className="text-[#94A0AD]" aria-hidden="true" />
              {STATUS_LABEL[activity.status]}
            </motion.p>

            <motion.p
              layout="position"
              className={[
                'mt-4 text-[15px] leading-relaxed text-[#C7CFD8]',
                expanded ? '' : 'line-clamp-2',
              ].join(' ')}
            >
              {activity.summary}
            </motion.p>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                  transition={reduced ? { duration: 0.15 } : motionTokens.content}
                  className="space-y-4 pt-4"
                >
                  {activity.details.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] leading-relaxed text-[#C7CFD8]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout="position"
              type="button"
              aria-expanded={expanded}
              onClick={(event) => {
                event.stopPropagation()
                setExpanded((value) => !value)
              }}
              className="mt-4 text-[14px] font-semibold text-white"
            >
              {expanded ? 'แสดงน้อยลง' : '…เพิ่มเติม'}
            </motion.button>
          </motion.section>
          </div>
        </div>

      </div>

      {/* กิจกรรมอื่นย้ายลงมาเต็มความกว้างท้ายหน้า */}
      <section ref={railRef} className="mx-auto mt-14 max-w-[960px]">
        <motion.h2 {...enter(0.18)} className="text-[15px] font-semibold text-white">
          กิจกรรมอื่นที่น่าสนใจ
        </motion.h2>

        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {others.map((item, index) => (
            <RecommendationItem
              key={item.slug}
              activity={item}
              reduced={reduced}
              delay={reduced ? 0 : 0.2 + index * 0.035}
            />
          ))}
        </div>

        <motion.div {...enter(0.34)} className="mt-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline"
          >
            ดูทั้งหมด
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
