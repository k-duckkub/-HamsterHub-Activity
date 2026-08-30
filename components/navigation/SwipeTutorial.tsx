'use client'

import { useEffect } from 'react'
import { animate, motion, type MotionValue } from 'framer-motion'
import { Hand, ArrowLeft, ArrowRight } from 'lucide-react'
import { tutorialSequence, swipeReturnSpring } from '@/lib/swipe'
import RippleButton from '@/components/ui/RippleButton'

type SwipeTutorialProps = {
  title: string
  description?: string
  /** ค่า x ของหน้าปัจจุบัน ใช้สาธิตให้หน้าขยับตามนิ้ว */
  pageX: MotionValue<number>
  /** ทิศที่หน้าจะเคลื่อนตอนปัดสำเร็จ (-1 = ไปทางซ้าย) */
  sign: number
  reduced: boolean
  onDismiss: () => void
}

/** สอนท่าปัดครั้งแรก: overlay บาง ๆ + การ์ดกระจกกลางจอ สาธิต 2 ครั้งแล้วหยุด */
export default function SwipeTutorial({
  title,
  description,
  pageX,
  sign,
  reduced,
  onDismiss,
}: SwipeTutorialProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onDismiss])

  // สาธิตด้วยการขยับหน้าจริงไปขวา ~20px แล้วคืนที่ ทำซ้ำ 2 ครั้งแล้วหยุดนิ่ง
  useEffect(() => {
    if (reduced) return
    let cancelled = false

    const run = async () => {
      await new Promise((resolve) =>
        window.setTimeout(resolve, tutorialSequence.initialDelay)
      )
      for (let round = 0; round < tutorialSequence.repeat; round += 1) {
        if (cancelled) return
        await animate(pageX, sign * tutorialSequence.pagePeek, {
          duration: tutorialSequence.dragDuration,
          ease: [0.22, 1, 0.36, 1],
        })
        await new Promise((resolve) =>
          window.setTimeout(resolve, tutorialSequence.holdDuration * 1000)
        )
        if (cancelled) return
        await animate(pageX, 0, swipeReturnSpring)
        await new Promise((resolve) =>
          window.setTimeout(resolve, tutorialSequence.repeatDelay * 1000)
        )
      }
    }

    void run()
    return () => {
      cancelled = true
      pageX.stop()
      pageX.set(0)
    }
  }, [pageX, reduced, sign])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="absolute inset-0 bg-black/[0.28]" />

      <motion.div
        role="status"
        className="pointer-events-auto relative w-full max-w-[340px] rounded-[20px] px-6 py-7 text-center"
        style={{
          background: 'rgba(30, 30, 30, 0.76)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 18px 50px rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ scale: reduced ? 1 : 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mx-auto mb-5 h-12 w-full max-w-[180px]">
          <motion.span
            className="absolute top-1 text-white"
            initial={{ x: -sign * 18 }}
            animate={reduced ? { x: sign * 14 } : { x: [-sign * 18, sign * 46, -sign * 18] }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration:
                      tutorialSequence.dragDuration +
                      tutorialSequence.returnDuration,
                    times: [0, 0.62, 1],
                    ease: [0.22, 1, 0.36, 1],
                    repeat: tutorialSequence.repeat - 1,
                    repeatDelay: tutorialSequence.repeatDelay,
                  }
            }
          >
            <Hand size={30} strokeWidth={1.6} aria-hidden="true" />
          </motion.span>
          <motion.span
            className={`absolute top-2 text-primary ${sign === 1 ? 'left-2' : 'right-2'}`}
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: [0.25, 1, 0.25], x: [0, sign * 6, 0] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.2, repeat: tutorialSequence.repeat, ease: 'easeInOut' }
            }
          >
            {sign === 1 ? (
              <ArrowRight size={26} strokeWidth={2} aria-hidden="true" />
            ) : (
              <ArrowLeft size={26} strokeWidth={2} aria-hidden="true" />
            )}
          </motion.span>
        </div>

        <p className="text-[17px] font-semibold text-white">{title}</p>
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">{description}</p>
        )}

        <RippleButton
          reduced={reduced}
          onClick={onDismiss}
          className="mt-5 border border-white/15 px-5 py-2 text-white hover:bg-white/10"
        >
          เข้าใจแล้ว
        </RippleButton>
      </motion.div>
    </motion.div>
  )
}
