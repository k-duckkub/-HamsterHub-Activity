'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  NO_SWIPE_SELECTOR,
  swipeCommitSpring,
  swipeIntent,
  swipeReturnSpring,
  swipeThreshold,
} from '@/lib/swipe'
import RippleButton from '@/components/ui/RippleButton'
import PagePreview from './PagePreview'

/** จำว่าเพิ่งปัดมาจากหน้าไหน เพื่อให้ปัดกลับใช้ history ได้ถูกต้อง */
const SWIPE_ORIGIN_KEY = 'hamsterhub-swipe-origin'
import SwipeEdgeHint from './SwipeEdgeHint'
import SwipeTutorial from './SwipeTutorial'

type SwipePageShellProps = {
  /**
   * ฝั่งที่หน้าปลายทางวางอยู่ในผัง — 'right' คือปลายทางอยู่ทางขวา
   * ผู้ใช้จึงต้องปัดเนื้อหาไปทางซ้ายเพื่อดึงมันเข้ามา
   */
  direction: 'right' | 'left'
  destination: string
  preview: ReactNode
  children: ReactNode
  /** ปัดสำเร็จแล้วถอยกลับด้วย history ถ้ามีหน้าก่อนหน้าอยู่จริง */
  preferBack?: boolean
  /** ข้อความบนปุ่มขอบจอ บอกว่ากดแล้วไปไหน */
  actionLabel: string
  tutorial?: {
    title: string
    description?: string
    storageKey: string
  }
}

export default function SwipePageShell({
  direction,
  destination,
  preview,
  children,
  preferBack = false,
  actionLabel,
  tutorial,
}: SwipePageShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const [viewportWidth, setViewportWidth] = useState(1024)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [swiped, setSwiped] = useState(true)

  // ปลายทางอยู่ขวา = ลากเนื้อหาไปทางซ้าย (x ติดลบ)
  const sign = direction === 'right' ? -1 : 1

  const x = useMotionValue(0)
  const dragControls = useDragControls()

  const navigatingRef = useRef(false)
  const startRef = useRef<{ x: number; y: number; blocked: boolean } | null>(null)
  const draggingRef = useRef(false)

  useEffect(() => setHydrated(true), [])

  // ขนาดจอ ใช้คิด threshold และระยะที่ต้องพาหน้าออกไป
  useEffect(() => {
    const measure = () => setViewportWidth(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // เตรียมหน้าปลายทางไว้ล่วงหน้า จะได้ไม่มีจอว่างตอนปัด
  useEffect(() => {
    router.prefetch(destination)
  }, [destination, router])


  // tutorial + edge hint: แสดงเฉพาะครั้งแรกของ session
  useEffect(() => {
    if (!tutorial) return
    try {
      const seen = sessionStorage.getItem(tutorial.storageKey) === 'true'
      setSwiped(seen)
      setTutorialOpen(!seen)
    } catch {
      setTutorialOpen(true)
      setSwiped(false)
    }
  }, [tutorial])

  const markSeen = useCallback(() => {
    setTutorialOpen(false)
    if (!tutorial) return
    try {
      sessionStorage.setItem(tutorial.storageKey, 'true')
    } catch {
      /* โหมดส่วนตัวบางเบราว์เซอร์เขียนไม่ได้ ปล่อยผ่าน */
    }
  }, [tutorial])

  const commit = useCallback(async () => {
    if (navigatingRef.current) return
    navigatingRef.current = true
    markSeen()
    setSwiped(true)

    if (reduced) {
      await animate(x, sign * viewportWidth, { duration: 0.15, ease: 'easeOut' })
    } else {
      await animate(x, sign * viewportWidth, swipeCommitSpring)
    }

    // ถอยกลับก็ต่อเมื่อหน้าก่อนหน้าคือปลายทางจริง ๆ (ผู้ใช้ปัดมาจากหน้านั้น)
    let cameFromDestination = false
    try {
      cameFromDestination = sessionStorage.getItem(SWIPE_ORIGIN_KEY) === destination
    } catch {
      /* เขียน/อ่านไม่ได้ก็ถือว่าไม่ได้มาจากหน้านั้น */
    }

    if (preferBack && cameFromDestination) {
      router.back()
      return
    }

    try {
      sessionStorage.setItem(SWIPE_ORIGIN_KEY, pathname)
    } catch {
      /* ไม่ซีเรียส ถ้าเขียนไม่ได้ก็แค่ push ตามปกติ */
    }
    router.push(destination)
  }, [
    destination,
    markSeen,
    pathname,
    preferBack,
    reduced,
    router,
    sign,
    viewportWidth,
    x,
  ])

  const cancel = useCallback(() => {
    void animate(x, 0, reduced ? { duration: 0.15, ease: 'easeOut' } : swipeReturnSpring)
  }, [reduced, x])

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (navigatingRef.current) return
    const target = event.target as HTMLElement
    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      // ปุ่ม ลิงก์ ช่องกรอก และแถบเลื่อนแนวนอน ได้สิทธิ์ก่อนเสมอ
      blocked: Boolean(target.closest(NO_SWIPE_SELECTOR)),
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const start = startRef.current
    if (!start || start.blocked || draggingRef.current || navigatingRef.current) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const horizontal =
      Math.abs(deltaX) > swipeIntent.minDistance &&
      Math.abs(deltaX) > Math.abs(deltaY) * swipeIntent.horizontalRatio

    // ทิศผิดก็ไม่เริ่ม ปล่อยให้หน้าเลื่อนแนวตั้งตามปกติ
    if (!horizontal || Math.sign(deltaX) !== sign) return

    draggingRef.current = true
    dragControls.start(event.nativeEvent)
  }

  const onPointerUp = () => {
    startRef.current = null
  }

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    draggingRef.current = false
    startRef.current = null

    const offset = info.offset.x * sign
    const velocity = info.velocity.x * sign
    const passed =
      offset > swipeThreshold.minDistance &&
      (offset > viewportWidth * swipeThreshold.distanceRatio ||
        velocity > swipeThreshold.velocity)

    if (passed) void commit()
    else cancel()
  }

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
      void commit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commit, direction])

  const dragConstraints = useMemo(
    () =>
      sign === 1
        ? { left: 0, right: viewportWidth }
        : { left: -viewportWidth, right: 0 },
    [sign, viewportWidth]
  )

  // หน้าปลายทางวางติดกับหน้าปัจจุบันพอดีหนึ่งจอ ทั้งคู่จึงเลื่อนไปด้วยกันเหมือนแผ่นเดียว
  const previewX = useTransform(x, (value) => value - sign * viewportWidth)

  return (
    <>
      <PagePreview x={previewX} pageX={x}>
        {preview}
      </PagePreview>

      <motion.main
        className="swipe-page swipe-layer relative z-10 min-h-[100dvh] bg-[#0D1117]"
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={dragConstraints}
        dragElastic={0.025}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </motion.main>

      {direction === 'right' && <SwipeEdgeHint side="right" visible={!swiped} />}

      {/* ปุ่มขอบจอ: บอกชื่อหน้าปลายทางตรง ๆ และขยับเป็นจังหวะให้รู้ว่ายังมีหน้าต่อไป */}
      <div
        className={[
          // มือถือวางไว้เหนือแถบล่าง จะได้ไม่ทับปุ่มอื่นกลางจอ
          'fixed z-30 bottom-[calc(72px+env(safe-area-inset-bottom))] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2',
          direction === 'right' ? 'right-4 sm:right-5' : 'left-4 sm:left-5',
        ].join(' ')}
      >
        <motion.div
          animate={
            reduced ? {} : { x: direction === 'right' ? [0, 6, 0] : [0, -6, 0] }
          }
          transition={
            reduced
              ? {}
              : { duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }
          }
        >
          <RippleButton
            reduced={reduced}
            onClick={() => void commit()}
            aria-label={`${actionLabel} (ปัดไปทาง${direction === 'right' ? 'ซ้าย' : 'ขวา'}ก็ได้)`}
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

      <AnimatePresence>
        {tutorial && tutorialOpen && (
          <SwipeTutorial
            key="tutorial"
            title={tutorial.title}
            description={tutorial.description}
            pageX={x}
            sign={sign}
            reduced={reduced}
            onDismiss={markSeen}
          />
        )}
      </AnimatePresence>
    </>
  )
}
