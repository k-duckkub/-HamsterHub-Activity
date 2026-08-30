'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
} from 'framer-motion'
import type { Project } from '@/data/projects'
import { spaces } from '@/data/spaces'
import {
  buttonSpring,
  cardHoverTransition,
  lockImpactMotion,
  reducedTransition,
  shortSpinMotion,
  shortSpinMotionReduced,
  shortHoverMotion,
  shortsSequenceMotion,
  winGlowMotion,
} from '@/lib/motion'
import CoinBurst from './CoinBurst'
import SpaceIcon from './SpaceIcon'

export type ShortSlotState = 'facedown' | 'spinning' | 'revealed'

type ShortSlotProps = {
  slotIndex: number
  project: Project
  decoys: Project[]
  locked: boolean
  forceFullMotion: boolean
  /** true เมื่อ section ถูกเลื่อนเข้ามา = ดึงคันโยกหนึ่งครั้ง วงล้อทุกใบออกตัวพร้อมกัน */
  autoSpin: boolean
  onReveal: (slotIndex: number, title: string) => void
}

/** ช่องแรกของวงล้อ: หน้าไพ่คว่ำที่เห็นก่อนกด */
function CardBack() {
  return (
    <span className="relative grid h-full w-full place-items-center overflow-hidden bg-[#161D26]">
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,transparent_25%,#27313B_25%,#27313B_26%,transparent_26%,transparent_75%,#27313B_75%,#27313B_76%,transparent_76%)] [background-size:28px_28px]"
      />
      <span aria-hidden="true" className="relative text-[58px] font-bold text-[#3A4552] sm:text-[72px]">
        ?
      </span>
    </span>
  )
}

function ShortArtwork({ project, compact = false }: { project: Project; compact?: boolean }) {
  const space = spaces.find((item) => item.id === project.spaceId)

  return (
    <span
      className="relative block h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(125% 90% at 50% 12%, ${project.tint[0]} 0%, ${project.tint[1]} 76%)`,
      }}
    >
      <span className="absolute inset-x-[12%] top-[12%] block overflow-hidden rounded-[18px] opacity-90 ring-1 ring-white/15">
        {space ? (
          <SpaceIcon position={space.iconPosition} title={space.title} />
        ) : (
          <span className="block aspect-square bg-[#161D26]" />
        )}
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#0D1117] via-[#0D1117]/80 to-transparent" />
      {!compact && (
        <span className="absolute inset-x-4 bottom-4 text-left">
          <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-white sm:text-[16px]">
            {project.title}
          </span>
          <span className="mt-1 block truncate text-[12px] text-white/55">{project.creator}</span>
        </span>
      )}
    </span>
  )
}

export default function ShortSlot({
  slotIndex,
  project,
  decoys,
  locked,
  forceFullMotion,
  autoSpin,
  onReveal,
}: ShortSlotProps) {
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<ShortSlotState>('facedown')
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const stateRef = useRef<ShortSlotState>('facedown')
  const sourceRef = useRef<'click' | 'auto' | null>(null)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)
  const frameRef = useRef<HTMLSpanElement | null>(null)
  // วัดความสูงจริงของกรอบ เพราะ % ของ transform อิงความสูงของแถบ ไม่ใช่ของช่อง
  const [frameHeight, setFrameHeight] = useState(0)
  const reduced = hydrated && reducedPreference && !forceFullMotion
  const config = reduced ? shortSpinMotionReduced : shortSpinMotion
  const reelY = useMotionValue(0)
  const reelVelocity = useVelocity(reelY)
  const blurAmount = useTransform(
    reelVelocity,
    [-config.blurVelocityMax, 0, config.blurVelocityMax],
    [config.motionBlur, 0, config.motionBlur],
    { clamp: true },
  )
  const speedLineOpacity = useTransform(
    reelVelocity,
    [-config.blurVelocityMax, 0, config.blurVelocityMax],
    [config.speedLineOpacity, 0, config.speedLineOpacity],
    { clamp: true },
  )
  const reelFilter = useMotionTemplate`blur(${blurAmount}px)`

  const setSlotState = useCallback((next: ShortSlotState) => {
    stateRef.current = next
    setState(next)
  }, [])

  useEffect(() => {
    setHydrated(true)
    return () => {
      animationRef.current?.stop()
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => setFrameHeight(frame.getBoundingClientRect().height)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  /** แถบวงล้อ: หน้าไพ่คว่ำ → decoy หลายใบ → ผลงานจริงเป็นใบสุดท้ายเสมอ */
  const reel = useMemo<(Project | null)[]>(() => {
    const pool = decoys.filter((item) => item.id !== project.id)
    const middle = Array.from({ length: config.reelLength }, (_, index) => {
      const pick = pool.length ? pool[(slotIndex * 7 + index * 3) % pool.length] : undefined
      return pick ?? project
    })
    return [null, ...middle, project]
  }, [decoys, project, slotIndex, config.reelLength])

  const stops = reel.length - 1
  const interactive = state === 'facedown' && !locked
  // ทุกใบออกตัวพร้อมกัน แต่ใบถัดไปหมุนนานกว่า จึงหยุดไล่ทีละใบ 1 2 3 4 5
  const stopStagger = reduced
    ? shortsSequenceMotion.reducedStopStagger
    : shortsSequenceMotion.stopStagger
  const spinDuration = config.baseDuration + slotIndex * stopStagger
  const travel = -frameHeight * stops
  const overshoot = (frameHeight * config.overshoot) / 100

  const finishReveal = useCallback(() => {
    if (stateRef.current === 'revealed') return
    reelY.set(travel)
    sourceRef.current = null
    setSlotState('revealed')
    onReveal(slotIndex, project.title)
  }, [onReveal, project.title, reelY, setSlotState, slotIndex, travel])

  /** ปั่นหนึ่งครั้งแล้วหยุดเอง — ใช้ทั้งตอนกดเองและตอนถูกสั่งจากการเลื่อนเข้ามา */
  const runSpin = useCallback(
    (source: 'click' | 'auto') => {
      if (stateRef.current !== 'facedown' || frameHeight <= 0) return

      setHovered(false)
      setPressed(false)
      sourceRef.current = source
      setSlotState('spinning')

      const run = async () => {
        animationRef.current = animate(reelY, travel - overshoot, {
          duration: spinDuration,
          ease: config.ease,
        })
        await animationRef.current

        if (sourceRef.current !== source) return
        animationRef.current = animate(reelY, travel, config.settleTransition)
        await animationRef.current

        if (sourceRef.current === source) finishReveal()
      }

      void run()
    },
    [
      config.ease,
      config.settleTransition,
      finishReveal,
      frameHeight,
      overshoot,
      reelY,
      setSlotState,
      spinDuration,
      travel,
    ],
  )

  // เลื่อนเข้ามาครั้งเดียว = ออกตัวพร้อมกันทุกใบ แล้วแต่ละใบหยุดตามคิวของตัวเอง
  useEffect(() => {
    if (!autoSpin || frameHeight <= 0) return
    runSpin('auto')
  }, [autoSpin, frameHeight, runSpin])

  const reveal = () => {
    if (!interactive) return
    runSpin('click')
  }

  // เปิดแล้วชี้เมาส์ = ขยายเด่นขึ้นเพื่ออ่านรายละเอียด ยังคว่ำอยู่ = ยกเบา ๆ เหมือนการ์ดอื่น
  const opened = state === 'revealed'
  const raised = hovered && !reduced && (interactive || opened)
  const hoverMotion = reduced
    ? {}
    : {
        y: raised ? (opened ? shortHoverMotion.lift : -4) : 0,
        scale: pressed && interactive ? 0.988 : raised ? (opened ? shortHoverMotion.scale : 1.012) : 1,
        zIndex: raised && opened ? 30 : 0,
      }

  const buttonAnimation =
    state === 'spinning' && !reduced
      ? { scale: config.settleScale, x: 0, y: [...config.spinJitterY] }
      : state === 'revealed' && !reduced
        ? {
            scale: 1,
            x: [...lockImpactMotion.shakeX],
            y: [...lockImpactMotion.shakeY],
          }
        : { scale: 1, x: 0, y: 0 }

  const buttonTransition =
    state === 'spinning' && !reduced
      ? {
          scale: buttonSpring,
          x: buttonSpring,
          y: config.spinJitterTransition,
        }
      : state === 'revealed' && !reduced
        ? {
            scale: buttonSpring,
            x: { duration: lockImpactMotion.duration, ease: lockImpactMotion.ease },
            y: { duration: lockImpactMotion.duration, ease: lockImpactMotion.ease },
          }
        : reduced
          ? reducedTransition
          : buttonSpring

  return (
    <motion.div
      className="relative min-w-0"
      animate={hoverMotion}
      transition={reduced ? reducedTransition : pressed ? buttonSpring : cardHoverTransition}
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
    >
      <motion.button
        type="button"
        aria-label={opened ? `ดูรายละเอียด ${project.title} โดย ${project.creator}` : `เปิดผลงานช่องที่ ${slotIndex + 1}`}
        data-motion-mode={reduced ? 'reduced' : 'full'}
        disabled={!interactive && !opened}
        onClick={reveal}
        onPointerDown={() => interactive && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        animate={buttonAnimation}
        transition={buttonTransition}
        className="relative block aspect-[9/16] w-full cursor-pointer rounded-[18px] text-left shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_4px_10px_rgba(0,0,0,0.24),0_18px_45px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-default"
        style={{
          transitionDuration: `${cardHoverTransition.duration}s`,
          transitionTimingFunction: `cubic-bezier(${cardHoverTransition.ease.join(',')})`,
        }}
      >
        {/* กรอบตู้: ทุกอย่างในวงล้อถูกตัดที่ขอบการ์ด */}
        <span ref={frameRef} className="absolute inset-0 block overflow-hidden rounded-[18px]">
          <motion.span
            className="absolute inset-x-0 top-0 block"
            style={{
              height: `${reel.length * 100}%`,
              willChange: 'transform, filter',
              y: reelY,
              filter: reelFilter,
            }}
          >
            {reel.map((item, index) => (
              <span key={index} className="block w-full" style={{ height: `${100 / reel.length}%` }}>
                {item ? (
                  <ShortArtwork
                    project={item}
                    compact={index !== reel.length - 1 || (opened && hovered && !reduced)}
                  />
                ) : (
                  <CardBack />
                )}
              </span>
            ))}
          </motion.span>

          {/* เงาบน–ล่างของกรอบตู้ ทำให้ภาพที่ไหลผ่านดูอยู่ในช่องจริง */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/55 to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/45 to-transparent"
          />

          {state === 'spinning' && !reduced && (
            <motion.span
              aria-hidden="true"
              data-speed-lines="true"
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
              style={{ opacity: speedLineOpacity }}
            >
              {Array.from({ length: config.speedLineCount }, (_, index) => (
                <motion.span
                  key={index}
                  className="absolute top-0 h-[28%] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  style={{ left: `${8 + index * 14}%` }}
                  animate={{ y: [...config.speedLineTravel] }}
                  transition={{
                    duration:
                      config.speedLineDuration + index * config.speedLineDurationStep,
                    delay: index * config.speedLineDelayStep,
                    ease: config.speedLineEase,
                    repeat: config.speedLineRepeat,
                  }}
                />
              ))}
            </motion.span>
          )}
        </span>

        {/* เปิดแล้วชี้เมาส์: ม่านมืดจาง ๆ พร้อมชื่อผลงานกับผู้สร้าง */}
        {opened && !reduced && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] flex items-end rounded-[18px] bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: shortHoverMotion.duration, ease: shortHoverMotion.ease }}
          >
            <motion.span
              className="block w-full"
              animate={{ y: hovered ? 0 : 10 }}
              transition={{
                duration: shortHoverMotion.duration,
                ease: shortHoverMotion.ease,
                delay: hovered ? shortHoverMotion.overlayDelay : 0,
              }}
            >
              <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">
                {project.title}
              </span>
              <span className="mt-1 block truncate text-[12px] text-white/60">
                {project.creator} · ผู้รับชม {project.viewers} คน
              </span>
            </motion.span>
          </motion.span>
        )}

        {state === 'revealed' && (
          <>
            {!reduced && (
              <motion.span
                aria-hidden="true"
                data-shockwave="true"
                className="pointer-events-none absolute inset-0 z-20 rounded-[18px] border-2 border-[#3DDC84]"
                initial={{
                  opacity: lockImpactMotion.shockwaveOpacity[0],
                  scale: lockImpactMotion.shockwaveScale[0],
                }}
                animate={{
                  opacity: [...lockImpactMotion.shockwaveOpacity],
                  scale: [...lockImpactMotion.shockwaveScale],
                }}
                transition={{
                  duration: lockImpactMotion.shockwaveDuration,
                  ease: lockImpactMotion.shockwaveEase,
                  times: [...lockImpactMotion.shockwaveTimes],
                }}
              />
            )}

            {/* ขอบเขียว "สำเร็จ" เด้งออกมารอบการ์ด */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 rounded-[18px]"
              initial={{ opacity: winGlowMotion.ringOpacity[0], scale: winGlowMotion.ringScale[0] }}
              animate={{
                opacity: [...winGlowMotion.ringOpacity],
                scale: [...winGlowMotion.ringScale],
              }}
              transition={
                reduced
                  ? reducedTransition
                  : {
                      duration: winGlowMotion.duration,
                      ease: winGlowMotion.ease,
                      times: [...winGlowMotion.times],
                    }
              }
              style={{
                boxShadow: `0 0 0 2px ${winGlowMotion.color}, 0 0 34px ${winGlowMotion.color}80, inset 0 0 26px ${winGlowMotion.color}33`,
              }}
            />
            <CoinBurst forceFullMotion={forceFullMotion} />
          </>
        )}
      </motion.button>
    </motion.div>
  )
}
