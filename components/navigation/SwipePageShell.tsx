'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

/** จำว่ามาจากหน้าไหน เพื่อให้ปุ่มย้อนกลับใช้ history ได้ถูกต้อง */
const PAGE_ORIGIN_KEY = 'hamsterhub-page-origin'

type PageShellProps = {
  /** ฝั่งที่หน้าปลายทางวางอยู่ในผัง — 'right' คือปลายทางอยู่ทางขวา */
  direction: 'right' | 'left'
  destination: string
  children: ReactNode
  /** กดแล้วถอยกลับด้วย history ถ้าหน้าก่อนหน้าคือปลายทางจริง ๆ */
  preferBack?: boolean
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
  preferBack = false,
  actionLabel,
}: PageShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const navigatingRef = useRef(false)

  useEffect(() => setHydrated(true), [])

  // เตรียมหน้าปลายทางไว้ล่วงหน้า จะได้ไม่มีจอว่างตอนกด
  useEffect(() => {
    router.prefetch(destination)
  }, [destination, router])

  const go = useCallback(() => {
    if (navigatingRef.current) return
    navigatingRef.current = true

    let cameFromDestination = false
    try {
      cameFromDestination = sessionStorage.getItem(PAGE_ORIGIN_KEY) === destination
    } catch {
      /* เขียน/อ่านไม่ได้ก็ถือว่าไม่ได้มาจากหน้านั้น */
    }

    if (preferBack && cameFromDestination) {
      router.back()
      return
    }

    try {
      sessionStorage.setItem(PAGE_ORIGIN_KEY, pathname)
    } catch {
      /* ไม่ซีเรียส ถ้าเขียนไม่ได้ก็แค่ push ตามปกติ */
    }
    router.push(destination)
  }, [destination, pathname, preferBack, router])

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
          // มือถือวางไว้เหนือแถบล่าง จะได้ไม่ทับปุ่มอื่นกลางจอ
          'fixed z-30 bottom-[calc(72px+env(safe-area-inset-bottom))] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2',
          direction === 'right' ? 'right-4 sm:right-5' : 'left-4 sm:left-5',
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
