'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

type PageShellProps = {
  /** ฝั่งที่หน้าปลายทางวางอยู่ในผัง — 'right' คือปลายทางอยู่ทางขวา */
  direction: 'right' | 'left'
  destination: string
  children: ReactNode
  /** ข้อความบนปุ่มขอบจอ บอกว่ากดแล้วไปไหน */
  actionLabel: string
}

/**
 * เปลี่ยนหน้าด้วยปุ่มที่ขอบจออย่างเดียว — ไม่มีการปัด
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

  return (
    <>
      <main>{children}</main>

      {/* ปุ่มขอบจอ: บอกชื่อหน้าปลายทางตรง ๆ และขยับเป็นจังหวะให้รู้ว่ายังมีหน้าต่อไป */}
      <div
        className={[
          // อยู่มุมล่างเสมอ กลางจอเคยไปทับการ์ดและปุ่มอื่น
          'fixed z-30 bottom-[calc(72px+env(safe-area-inset-bottom))] sm:bottom-6',
          direction === 'right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6',
        ].join(' ')}
      >
        <motion.div
          animate={reduced ? {} : { x: direction === 'right' ? [0, 6, 0] : [0, -6, 0] }}
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
            className={[
              'flex items-center gap-1.5 py-3 pl-4 pr-3.5 text-[14px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
              direction === 'right'
                ? 'bg-primary text-white hover:brightness-110'
                : 'border border-white/15 bg-[#151B22] text-white hover:bg-[#1C242E]',
            ].join(' ')}
          >
            {direction === 'left' && <ChevronLeft size={18} aria-hidden="true" />}
            <span>{actionLabel}</span>
            {direction === 'right' && <ChevronRight size={18} aria-hidden="true" />}
          </RippleButton>
        </motion.div>
      </div>
    </>
  )
}
