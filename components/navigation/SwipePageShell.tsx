'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

type PageShellProps = {
  /** ฝั่งที่หน้าปลายทางวางอยู่ในผัง — 'right' คือปลายทางอยู่ทางขวา */
  direction: 'right' | 'left'
  destination: string
  children: ReactNode
  /** ข้อความบนปุ่มขอบจอ บอกว่ากดแล้วไปไหน */
  actionLabel: string
}

/** ระยะสะสมของการเลื่อนที่ถือว่าตั้งใจไปหน้าถัดไป */
const SCROLL_THRESHOLD = 120

/**
 * เปลี่ยนหน้าด้วยปุ่มที่ขอบจอ หรือเลื่อนลงต่อเมื่ออ่านจนสุดหน้าแล้ว — ไม่มีการปัด
 * ปุ่มบอกชื่อปลายทางและเอนไปทางขอบเป็นจังหวะ ให้รู้ว่ายังมีหน้าต่อไป
 */
export default function SwipePageShell({
  direction,
  destination,
  children,
  actionLabel,
}: PageShellProps) {
  const router = useRouter()
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const navigatingRef = useRef(false)

  useEffect(() => setHydrated(true), [])

  // เตรียมหน้าปลายทางไว้ล่วงหน้า จะได้ไม่มีจอว่างตอนกด
  useEffect(() => {
    router.prefetch(destination)
  }, [destination, router])

  // ไปหน้าที่ปุ่มบอกเสมอ ไม่ใช้ history.back() เพราะหน้าก่อนหน้าอาจไม่ใช่ปลายทาง
  const go = useCallback(() => {
    if (navigatingRef.current) return
    navigatingRef.current = true
    router.push(destination)
  }, [destination, router])

  // คีย์บอร์ด: ลูกศรตามทิศของหน้า และไม่ทำงานเมื่อโฟกัสอยู่ในช่องกรอก
  useEffect(() => {
    const wanted = direction === 'right' ? 'ArrowRight' : 'ArrowLeft'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== wanted) return
      const active = document.activeElement as HTMLElement | null
      if (
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT' ||
          active.isContentEditable)
      ) {
        return
      }
      event.preventDefault()
      go()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [direction, go])

  // อ่านจนสุดหน้าแล้วเลื่อนลงต่อ = ไปหน้าถัดไป (เฉพาะทิศไปข้างหน้า
  // หน้าที่ปุ่มชี้กลับไม่ควรถอยหลังเองเวลาผู้ใช้เลื่อนอ่าน)
  const scrolled = useRef(0)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    if (direction !== 'right') return

    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0 || !atBottom()) {
        scrolled.current = 0
        return
      }
      scrolled.current += event.deltaY
      if (scrolled.current >= SCROLL_THRESHOLD) {
        scrolled.current = 0
        go()
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      touchStart.current = atBottom() ? (event.touches[0]?.clientY ?? null) : null
    }
    const onTouchMove = (event: TouchEvent) => {
      const start = touchStart.current
      const current = event.touches[0]?.clientY
      if (start === null || current === undefined || !atBottom()) return
      if (start - current >= SCROLL_THRESHOLD) {
        touchStart.current = null
        go()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [direction, go])

  return (
    <>
      <main>{children}</main>

      {/* ท้ายหน้าบอกว่ายังมีหน้าถัดไป และเลื่อนลงต่อได้เลย */}
      {direction === 'right' && (
        <div className="mx-auto -mt-14 flex max-w-[1440px] justify-center px-5 pb-16 sm:px-8">
          <button
            type="button"
            onClick={go}
            aria-label={`เลื่อนลงต่อเพื่อ${actionLabel}`}
            className="flex items-center gap-1.5 rounded-full bg-white/[0.055] px-4 py-2 text-[13px] font-medium text-[#C7CFD8] transition-colors hover:bg-white/[0.1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>เลื่อนลงต่อเพื่อ{actionLabel}</span>
            {/* ขยับแค่ลูกศร ตัวปุ่มอยู่นิ่ง จะได้กดโดนเสมอ */}
            <motion.span
              className="inline-flex"
              animate={reduced ? {} : { y: [0, 4, 0] }}
              transition={reduced ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={16} aria-hidden="true" />
            </motion.span>
          </button>
        </div>
      )}

      {/* ทิศไปข้างหน้าใช้การเลื่อนลงกับป้ายท้ายหน้าแทน ปุ่มลอยจึงเหลือเฉพาะทางกลับ */}
      {direction === 'left' && (
        <div className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-4 z-30 sm:bottom-6 sm:left-6">
          <motion.div
            animate={reduced ? {} : { x: [0, -6, 0] }}
            transition={
              reduced
                ? {}
                : { duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }
            }
          >
            <RippleButton
              reduced={reduced}
              onClick={go}
              aria-label={actionLabel}
              className="flex items-center gap-1.5 border border-white/15 bg-[#151B22] py-3 pl-4 pr-3.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:bg-[#1C242E]"
            >
              <ChevronLeft size={18} aria-hidden="true" />
              <span>{actionLabel}</span>
            </RippleButton>
          </motion.div>
        </div>
      )}

    </>
  )
}
