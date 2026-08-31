'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  Clock,
  GraduationCap,
  Heart,
  Info,
  Send,
  Users,
  Wallet,
} from 'lucide-react'
import { activities, applyHref, type Activity } from '@/data/activities'
import { motionTokens } from '@/lib/motion'
import SpaceIcon from '@/components/explore/SpaceIcon'
import RippleButton from '@/components/ui/RippleButton'
import { usePersistentLike } from '@/hooks/usePersistentLike'
import { useToast } from '@/components/ui/Toast'
import { SHARE_MESSAGE, shareLink } from '@/lib/share'
import HighlightText from './HighlightText'
import RecommendationItem from './RecommendationItem'

gsap.registerPlugin(ScrollTrigger)

export default function ActivityDetail({ activity }: { activity: Activity }) {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const { liked, toggle: toggleLike } = usePersistentLike('activity', activity.slug)
  const toast = useToast()
  const [posterHovered, setPosterHovered] = useState(false)
  const [descriptionHovered, setDescriptionHovered] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

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

  const others = activities.filter((item) => item.slug !== activity.slug).slice(0, 5)

  // คำที่ทำเป็นสีส้มในคำอธิบาย
  const highlights = [activity.title, 'CampHub', 'HamsterHub', 'Hamster Hub']
  const apply = applyHref(activity)

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...motionTokens.content, duration: 0.38, delay: reduced ? 0 : delay },
  })

  return (
    <div ref={sectionRef} className="mx-auto max-w-[1440px] px-5 pb-24 pt-6 sm:px-8">
      {/* แบนเนอร์กิจกรรมเต็มความกว้าง */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.38 }}
        onPointerEnter={() => setPosterHovered(true)}
        onPointerLeave={() => setPosterHovered(false)}
        className="overflow-hidden rounded-[16px]"
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
          className="grid aspect-[16/7] w-full place-items-center sm:aspect-[16/5]"
          style={{
            background: `radial-gradient(120% 160% at 70% 20%, ${activity.space.accent}4d 0%, ${activity.space.background} 68%)`,
          }}
        >
          <span className="block w-[16%] min-w-[104px] overflow-hidden rounded-[18px] ring-1 ring-white/10">
            <SpaceIcon
              position={activity.space.iconPosition}
              title={activity.space.title}
            />
          </span>
        </motion.div>
      </motion.div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <motion.p {...enter(0.06)} className="text-[14px] font-medium text-primary">
            {activity.space.category}
          </motion.p>

          {/* ชื่อกิจกรรมกับปุ่มอยู่บรรทัดเดียวกัน ปุ่มชิดขวา */}
          <div className="mt-2 flex items-start justify-between gap-4">
            <motion.h1
              {...enter(0.06)}
              tabIndex={-1}
              className="min-w-0 text-[28px] font-bold leading-tight text-white outline-none sm:text-[36px]"
            >
              {activity.space.title}
            </motion.h1>

            <motion.div {...enter(0.1)} className="flex shrink-0 items-center gap-1">
              <RippleButton
                reduced={reduced}
                aria-label={liked ? 'เลิกถูกใจกิจกรรมนี้' : 'ถูกใจกิจกรรมนี้'}
                aria-pressed={liked}
                onClick={toggleLike}
                className="flex items-center gap-2 bg-white/[0.055] px-3 py-2 text-white hover:bg-white/[0.105]"
              >
                {/* จังหวะกดใจแบบ IG: หัวใจยุบลงก่อนแล้วเด้งเกินตัวหนึ่งครั้ง พร้อมวงแหวนที่แผ่ออกไป */}
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
                    animate={
                      reduced ? {} : { scale: liked ? [1, 0.82, 1.28, 0.94, 1.06, 1] : 1 }
                    }
                    transition={
                      liked && !reduced
                        ? { duration: 0.62, times: [0, 0.13, 0.36, 0.58, 0.78, 1], ease: 'easeOut' }
                        : motionTokens.softSpring
                    }
                    className="inline-flex"
                  >
                    <Heart
                      size={20}
                      aria-hidden="true"
                      className={liked ? 'text-primary' : undefined}
                      fill={liked ? 'currentColor' : 'none'}
                    />
                  </motion.span>
                </span>
              </RippleButton>

              <RippleButton
                reduced={reduced}
                aria-label="แชร์กิจกรรมนี้"
                onClick={async () => {
                  const message =
                    SHARE_MESSAGE[
                      await shareLink({
                        title: activity.space.title,
                        path: `/activity/${activity.slug}`,
                      })
                    ]
                  if (message) toast.show(message)
                }}
                className="bg-white/[0.055] px-3 py-2 text-white hover:bg-white/[0.105]"
              >
                <Send size={19} aria-hidden="true" />
              </RippleButton>
            </motion.div>
          </div>


          {/* กล่องรายละเอียด — กางอยู่เสมอ ไม่มีปุ่มพับเก็บ */}
          <div ref={descriptionRef} className="mt-6">
          <motion.section
            onPointerEnter={() => setDescriptionHovered(true)}
            onPointerLeave={() => setDescriptionHovered(false)}
            animate={{
              backgroundColor: descriptionHovered
                ? 'rgba(255,255,255,0.075)'
                : 'rgba(255,255,255,0.055)',
            }}
            initial={false}
            transition={{ backgroundColor: motionTokens.hover }}
            className="rounded-[14px] p-5"
          >
            {/* ทุกช่องมาจาก CSV จริง ช่องไหนว่างก็ไม่แสดง */}
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                { icon: CalendarDays, label: 'วันที่จัด', value: activity.dateRange },
                { icon: Clock, label: 'เวลา/วันที่สอน', value: activity.scheduleNote },
                { icon: CircleCheck, label: 'รับสมัครถึง', value: activity.applyDeadline },
                { icon: Users, label: 'จำนวนที่รับ', value: activity.capacity },
                { icon: Wallet, label: 'ค่าใช้จ่าย', value: activity.fee },
                { icon: GraduationCap, label: 'คุณสมบัติผู้สมัคร', value: activity.eligibility },
                { icon: Info, label: 'เพิ่มเติม', value: activity.extraRequirement },
              ]
                .filter((row) => row.value !== '')
                .map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <row.icon
                      size={16}
                      className="mt-0.5 shrink-0 text-[#94A0AD]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-[12px] text-[#687482]">{row.label}</dt>
                      <dd className="text-[14px] text-white">{row.value}</dd>
                    </div>
                  </div>
                ))}
            </dl>

            {activity.summary !== '' && (
              <p className="mt-5 text-[15px] leading-relaxed text-[#C7CFD8]">
                <HighlightText text={activity.summary} terms={highlights} />
              </p>
            )}

            {apply && (
              <a
                href={apply}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-bold text-white transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                สมัครเข้าร่วม
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}

            {/* คำอธิบายเก็บทีละบรรทัดจาก CSV จึงคงรูปแบบเดิมไว้ทั้งหมด */}
            <div className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-[#C7CFD8]">
              <HighlightText text={activity.description.join('\n')} terms={highlights} />
            </div>
          </motion.section>
          </div>
        </div>

        {/* แถบนี้ยืดให้จบพร้อมกล่องรายละเอียดเสมอ รายการจึงกระจายเต็มความสูงของคอลัมน์ */}
        <aside ref={railRef} className="flex min-w-0 flex-col">
          <motion.h2 {...enter(0.18)} className="text-[18px] font-bold text-white">
            กิจกรรมอื่นที่น่าสนใจ
          </motion.h2>

          <div className="-mx-2.5 mt-4 flex flex-1 flex-col justify-between gap-3">
            {others.map((item, index) => (
              <RecommendationItem
                key={item.slug}
                activity={item}
                reduced={reduced}
                delay={reduced ? 0 : 0.2 + index * 0.035}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
