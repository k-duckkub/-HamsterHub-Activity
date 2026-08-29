'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
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
import PagePreview from './PagePreview'
import SwipeEdgeHint from './SwipeEdgeHint'
import SwipeTutorial from './SwipeTutorial'

type SwipePageShellProps = {
  /** ทิศที่ผู้ใช้ต้องปัดเพื่อไปหน้าปลายทาง */
  direction: 'right' | 'left'
  destination: string
  preview: ReactNode
  children: ReactNode
  /** ปัดสำเร็จแล้วถอยกลับด้วย history ถ้ามีหน้าก่อนหน้าอยู่จริง */
  preferBack?: boolean
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
  tutorial,
}: SwipePageShellProps) {
  const router = useRouter()
  const reducedPreference = useReducedMotion() ?? false
  const [hydrated, setHydrated] = useState(false)
  const reduced = hydrated && reducedPreference

  const [viewportWidth, setViewportWidth] = useState(1024)
  const [showArrow, setShowArrow] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [swiped, setSwiped] = useState(true)

  const sign = direction === 'right' ? 1 : -1
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

  // ปุ่มลูกศรโผล่เฉพาะเครื่องที่มีเมาส์
  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)')
    const apply = () => setShowArrow(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

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

    if (preferBack && window.history.length > 1) {
      router.back()
      return
    }
    router.push(destination)
  }, [destination, markSeen, preferBack, reduced, router, sign, viewportWidth, x])

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
      direction === 'right'
        ? { left: 0, right: viewportWidth }
        : { left: -viewportWidth, right: 0 },
    [direction, viewportWidth]
  )

  const scale = useTransform(x, [0, sign * viewportWidth], [1, 0.992])
  const opacity = useTransform(x, [0, sign * viewportWidth], [1, 0.96])
  const previewX = useTransform(
    x,
    [0, sign * viewportWidth],
    [`${-sign * 8}%`, '0%']
  )

  return (
    <>
      <PagePreview x={previewX}>{preview}</PagePreview>

      <motion.main
        className="swipe-page swipe-layer relative z-10 min-h-[100dvh] bg-[#0D1117]"
        style={{ x, scale: reduced ? 1 : scale, opacity: reduced ? 1 : opacity }}
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

      {direction === 'right' && <SwipeEdgeHint visible={!swiped} />}

      {showArrow && (
        <button
          type="button"
          onClick={() => void commit()}
          aria-label={
            direction === 'right' ? 'ไปหน้าผลงานของกิจกรรมนี้' : 'กลับหน้ารายละเอียดกิจกรรม'
          }
          className={[
            'fixed top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full',
            'border border-white/15 bg-black/40 text-white/70 opacity-0 transition-opacity duration-200',
            'hover:opacity-100 focus-visible:opacity-100 md:grid',
            direction === 'right' ? 'right-4' : 'left-4',
          ].join(' ')}
        >
          {direction === 'right' ? (
            <ChevronRight size={20} aria-hidden="true" />
          ) : (
            <ChevronLeft size={20} aria-hidden="true" />
          )}
        </button>
      )}

      <AnimatePresence>
        {tutorial && tutorialOpen && (
          <SwipeTutorial
            key="tutorial"
            title={tutorial.title}
            description={tutorial.description}
            pageX={x}
            reduced={reduced}
            onDismiss={markSeen}
          />
        )}
      </AnimatePresence>
    </>
  )
}
