'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Activity } from '@/data/activities'
import { HOVER_INTENT_MS, motionTokens } from '@/lib/motion'
import SpaceIcon from '@/components/explore/SpaceIcon'

/** หนึ่งรายการในแถบ “กิจกรรมอื่นที่น่าสนใจ” — กรอบใสครอบทั้งแถวตอนชี้ */
export default function RecommendationItem({
  activity,
  reduced,
  delay,
}: {
  activity: Activity
  reduced: boolean
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    []
  )

  // เมาส์กวาดผ่านเร็ว ๆ ไม่ต้องขึ้นกรอบ
  const enter = () => {
    timer.current = window.setTimeout(() => setHovered(true), HOVER_INTENT_MS)
  }
  const leave = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setHovered(false)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0)',
        borderColor: hovered ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0)',
        scale: hovered && !reduced ? 1.008 : 1,
      }}
      whileTap={
        reduced ? undefined : { scale: 0.988, backgroundColor: 'rgba(255,255,255,0.08)' }
      }
      transition={{
        opacity: { ...motionTokens.content, delay },
        y: { ...motionTokens.content, delay },
        backgroundColor: motionTokens.hover,
        borderColor: motionTokens.hover,
        scale: motionTokens.hover,
      }}
      onPointerEnter={enter}
      onPointerLeave={leave}
      className="relative -m-2 grid cursor-pointer grid-cols-[150px_minmax(0,1fr)] gap-3 overflow-hidden rounded-[12px] border border-transparent p-2"
    >
      <Link
        href={`/activity/${activity.slug}`}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="contents"
      >
        <span className="block overflow-hidden rounded-[10px]">
          <motion.span
            className="grid aspect-video w-full place-items-center"
            style={{
              background: `radial-gradient(120% 150% at 70% 20%, ${activity.space.accent}59 0%, ${activity.space.background} 70%)`,
            }}
            initial={false}
            animate={{
              scale: hovered && !reduced ? 1.035 : 1,
              filter: hovered ? 'brightness(1.04)' : 'brightness(0.92)',
            }}
            transition={motionTokens.content}
          >
            <span className="block w-[46%] overflow-hidden rounded-[8px]">
              <SpaceIcon
                position={activity.space.iconPosition}
                title={activity.space.title}
              />
            </span>
          </motion.span>
        </span>

        <span className="min-w-0 self-center">
          <motion.span
            className="block truncate text-[14px] font-medium"
            initial={false}
            animate={{ color: hovered ? '#FFFFFF' : '#F1F1F1' }}
            transition={motionTokens.hover}
          >
            {activity.space.title}
          </motion.span>
          <span className="mt-1 block text-[13px] text-[#94A0AD]">
            {activity.dateRange}
          </span>
        </span>
      </Link>
    </motion.article>
  )
}
