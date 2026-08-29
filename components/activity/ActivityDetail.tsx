'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Bookmark,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import Link from 'next/link'
import { activities, STATUS_LABEL, type Activity } from '@/data/activities'
import { buttonSpring, reducedTransition } from '@/lib/motion'
import SpaceIcon from '@/components/explore/SpaceIcon'

gsap.registerPlugin(ScrollTrigger)

const META = (activity: Activity) => [
  { label: 'วันที่จัด', value: activity.dateRange },
  { label: 'ขนาดทีม', value: activity.teamSize },
  { label: 'ค่าสมัคร', value: activity.fee },
  { label: 'รางวัล', value: activity.prize },
]

function ActionButton({
  label,
  active,
  onClick,
  children,
  reduced,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  reduced: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      whileHover={reduced ? undefined : { scale: 1.03, y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.97, y: 1 }}
      transition={reduced ? reducedTransition : buttonSpring}
      className={[
        'flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] transition-colors',
        active
          ? 'border-primary/60 bg-primary/15 text-primary'
          : 'border-[#27313B] text-[#94A0AD] hover:border-[#3A4552] hover:text-white',
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}

export default function ActivityDetail({ activity }: { activity: Activity }) {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  // GSAP ทำเฉพาะ scroll reveal ของบล็อกรายละเอียด ไม่แตะเลเยอร์ที่ Framer Motion ลากอยู่
  useLayoutEffect(() => {
    setHydrated(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      gsap.from(revealRef.current, {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: revealRef.current, start: 'top 85%' },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

  const others = activities
    .filter((item) => item.slug !== activity.slug)
    .slice(0, 4)

  return (
    <div ref={sectionRef} className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[18px] border border-[#27313B] bg-[#151B22]">
            <div className="mx-auto w-full max-w-[520px]">
              <SpaceIcon
                position={activity.space.iconPosition}
                title={activity.space.title}
              />
            </div>
          </div>

          <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.14em] text-primary">
            {activity.space.category}
          </p>
          <h1
            tabIndex={-1}
            className="mt-2 text-[30px] font-bold leading-tight text-white sm:text-[40px]"
          >
            {activity.space.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#27313B] text-[15px] font-semibold text-white"
              >
                {activity.organizerInitial}
              </span>
              <div>
                <p className="text-[15px] font-medium text-white">{activity.organizer}</p>
                <p className="text-[13px] text-[#687482]">
                  ผู้รับชม {activity.space.viewers} คน
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                label="ถูกใจ"
                active={liked}
                reduced={reduced}
                onClick={() => {
                  setLiked((value) => !value)
                  setDisliked(false)
                }}
              >
                <ThumbsUp size={17} aria-hidden="true" />
                ถูกใจ
              </ActionButton>
              <ActionButton
                label="ไม่ถูกใจ"
                active={disliked}
                reduced={reduced}
                onClick={() => {
                  setDisliked((value) => !value)
                  setLiked(false)
                }}
              >
                <ThumbsDown size={17} aria-hidden="true" />
              </ActionButton>
              <ActionButton label="แชร์" reduced={reduced}>
                <Share2 size={17} aria-hidden="true" />
                แชร์
              </ActionButton>
              <ActionButton
                label="บันทึก"
                active={saved}
                reduced={reduced}
                onClick={() => setSaved((value) => !value)}
              >
                <Bookmark size={17} aria-hidden="true" />
                บันทึก
              </ActionButton>
              <ActionButton label="เพิ่มเติม" reduced={reduced}>
                <MoreHorizontal size={17} aria-hidden="true" />
              </ActionButton>
            </div>
          </div>

          {/* กล่องรายละเอียดแบบ YouTube — ปัดเปลี่ยนหน้าจากในกล่องนี้ไม่ได้ */}
          <div
            ref={revealRef}
            data-no-page-swipe
            className="mt-7 rounded-[18px] border border-[#27313B] bg-[#151B22] p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-[13px] font-semibold text-primary">
                {STATUS_LABEL[activity.status]}
              </span>
              <span className="text-[13px] text-[#687482]">{activity.dateRange}</span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {META(activity).map((item) => (
                <div key={item.label}>
                  <dt className="text-[13px] text-[#687482]">{item.label}</dt>
                  <dd className="mt-1 text-[14px] font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[15px] leading-relaxed text-[#94A0AD]">
              {activity.summary}
            </p>

            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={reduced ? reducedTransition : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {activity.details.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-relaxed text-[#94A0AD]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="mt-4 text-[14px] font-semibold text-white hover:text-primary"
            >
              {expanded ? 'ย่อรายละเอียด' : '…เพิ่มเติม'}
            </button>
          </div>
        </div>

        <aside className="min-w-0">
          <h2 className="text-[15px] font-semibold text-white">กิจกรรมอื่นที่น่าสนใจ</h2>
          <ul className="mt-4 space-y-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/activity/${item.slug}`}
                  className="flex gap-3 rounded-[14px] border border-transparent p-2 transition-colors hover:border-[#27313B] hover:bg-[#151B22]"
                >
                  <span className="block w-[92px] shrink-0 overflow-hidden rounded-[10px]">
                    <SpaceIcon
                      position={item.space.iconPosition}
                      title={item.space.title}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium text-white">
                      {item.space.title}
                    </span>
                    <span className="mt-1 block text-[13px] text-[#687482]">
                      ผู้รับชม {item.space.viewers} คน
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
