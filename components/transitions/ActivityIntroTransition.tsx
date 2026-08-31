'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import {
  markIntroSeen,
  onIntroRequest,
  type IntroRequest,
} from '@/lib/activityIntro'
import TransitionLayer, { type IntroRefs } from './TransitionLayer'
import { INTRO_SOUNDS, useActivityIntro } from './useActivityIntro'

/** เวลาบนไทม์ไลน์ (วินาที) — ยาวรวม 3.06s */
const T = {
  routeChange: 1.18,
  reveal: 2.28,
  total: 3.06,
} as const

/** ไฟค้างได้อีกไม่เกินเท่านี้ถ้าหน้าปลายทางยังไม่พร้อม */
const MAX_FIRE_HOLD = 0.8

const VOLUME = 0.35

export default function ActivityIntroTransition() {
  const router = useRouter()
  const { assets, muted, hasSound } = useActivityIntro()
  const [request, setRequest] = useState<IntroRequest | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const navigatedRef = useRef(false)

  const refs: IntroRefs = {
    overlay: useRef<HTMLDivElement>(null),
    shade: useRef<HTMLDivElement>(null),
    dinosaur: useRef<HTMLDivElement>(null),
    fire: useRef<HTMLDivElement>(null),
    smoke: useRef<HTMLDivElement>(null),
    hand: useRef<HTMLDivElement>(null),
    sparks: useRef<HTMLDivElement>(null),
    skip: useRef<HTMLDivElement>(null),
  }

  useEffect(() => onIntroRequest(setRequest), [])

  const play = useCallback(
    (file: string) => {
      if (muted || !hasSound(file)) return
      try {
        const audio = new Audio(file)
        audio.volume = VOLUME
        // เบราว์เซอร์กันเสียงอัตโนมัติได้ ปล่อยให้ภาพเล่นต่อโดยไม่มีเสียง
        void audio.play().catch(() => undefined)
      } catch {
        /* เล่นไม่ได้ก็ข้าม */
      }
    },
    [hasSound, muted]
  )

  const finish = useCallback(() => {
    markIntroSeen()
    setRequest(null)
    navigatedRef.current = false
    // ให้โฟกัสไปที่หัวข้อกิจกรรมหลังม่านเปิด
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('main h1')?.focus()
    })
  }, [])

  const goToDestination = useCallback(() => {
    if (navigatedRef.current || !request) return
    navigatedRef.current = true
    router.push(request.destination)
  }, [request, router])

  useLayoutEffect(() => {
    if (!request) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      })
      timelineRef.current = timeline
      timeline.addLabel('reveal', T.reveal)

      // ม่านทึบขึ้นก่อน แล้วค่อยเป็นฉากของตัวละคร
      timeline
        .fromTo(refs.shade.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 }, 0)
        .fromTo(
          refs.skip.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2 },
          0.5
        )

      if (refs.dinosaur.current) {
        timeline
          .fromTo(
            refs.dinosaur.current,
            { xPercent: -125, yPercent: 30, rotate: -6, scale: 0.92 },
            { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 0.38 },
            0.1
          )
          // สูดลมก่อนพ่นไฟ ถอยหลังนิดเดียวแล้วหยุดค้าง
          .to(
            refs.dinosaur.current,
            { xPercent: -3, scale: 0.975, duration: 0.18, ease: 'power2.in' },
            0.42
          )
          .to(
            refs.dinosaur.current,
            { xPercent: -2, duration: 0.09, repeat: 5, yoyo: true, ease: 'sine.inOut' },
            0.72
          )
      }

      if (refs.fire.current) {
        timeline
          .call(() => play(INTRO_SOUNDS.fire), [], 0.62)
          .fromTo(
            refs.fire.current,
            { autoAlpha: 0, scaleX: 0.2, scaleY: 0.6, transformOrigin: '0% 50%' },
            { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.42, ease: 'power2.out' },
            0.62
          )
          // ไฟขยายจนคลุมจอ เป็นช่วงที่ซ่อนการเปลี่ยน route
          .to(refs.fire.current, { scale: 1.6, duration: 0.43, ease: 'power2.in' }, 0.95)
      }

      timeline.call(goToDestination, [], T.routeChange)

      if (refs.hand.current) {
        timeline.fromTo(
          refs.hand.current,
          { xPercent: 55, yPercent: -120, rotate: 12 },
          { xPercent: 0, yPercent: 0, rotate: 0, duration: 0.3, ease: 'power4.out' },
          1.35
        )
      }

      if (refs.dinosaur.current) {
        // จังหวะจับ: ย่อลงนิดหนึ่งแล้วค้างให้ทันมอง
        timeline
          .to(
            refs.dinosaur.current,
            { scale: 0.94, rotate: 4, duration: 0.12, ease: 'power2.inOut' },
            1.62
          )
          .call(() => play(INTRO_SOUNDS.grab), [], 1.64)
      }

      const lifted = [refs.dinosaur.current, refs.hand.current].filter(
        (node): node is HTMLDivElement => node !== null
      )
      if (lifted.length > 0) {
        timeline.to(
          lifted,
          { xPercent: 48, yPercent: -150, rotate: 8, duration: 0.44, ease: 'power3.in' },
          1.82
        )
      }

      if (refs.fire.current) {
        timeline.to(refs.fire.current, { autoAlpha: 0, duration: 0.48 }, 1.92)
      }

      if (refs.smoke.current) {
        timeline
          .fromTo(
            refs.smoke.current,
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 1, scale: 1, duration: 0.32 },
            1.92
          )
          .to(refs.smoke.current, { autoAlpha: 0, scale: 1.04, duration: 0.64 }, T.reveal)
      }

      // ม่านเปิดพร้อมควัน หน้าปลายทางค่อย ๆ สว่างขึ้นและคลายซูมนิดเดียว
      timeline
        .call(() => play(INTRO_SOUNDS.reveal), [], 2.3)
        .to(refs.shade.current, { autoAlpha: 0, duration: 0.5 }, T.reveal)
        .call(
          () => {
            const page = document.querySelector<HTMLElement>('main')
            if (!page) return
            gsap.fromTo(
              page,
              { scale: 1.008, filter: 'brightness(0.88)' },
              { scale: 1, filter: 'brightness(1)', duration: 0.55, ease: 'power2.out' }
            )
          },
          [],
          T.reveal
        )
        .to(refs.sparks.current, { autoAlpha: 0, duration: 0.34 }, 2.7)
        .to(refs.skip.current, { autoAlpha: 0, duration: 0.16 }, 2.7)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.12 }, 2.94)

      // ถ้าหน้าปลายทางยังไม่มา ให้ไฟค้างต่อได้อีกไม่เกิน 0.8s แล้วเดินหน้าต่อ
      timeline.call(
        () => {
          if (document.querySelector('main')) return
          timeline.pause()
          window.setTimeout(() => timeline.play(), MAX_FIRE_HOLD * 1000)
        },
        [],
        T.reveal - 0.02
      )
    }, rootRef)

    return () => {
      timelineRef.current = null
      context.revert()
      // หยุดวิดีโอก่อนถอด overlay ออก
      rootRef.current?.querySelectorAll('video').forEach((video) => video.pause())
    }
  }, [request, finish, goToDestination, play, refs.dinosaur, refs.fire, refs.hand, refs.shade, refs.skip, refs.smoke, refs.sparks])

  // ข้าม = กระโดดไปช่วงควันเปิดม่าน แล้วปล่อยให้ไทม์ไลน์เล่นจนจบตามปกติ
  const skip = useCallback(() => {
    goToDestination()
    const timeline = timelineRef.current
    if (!timeline) return
    timeline.tweenTo('reveal', {
      duration: 0.2,
      onComplete: () => timeline.play(),
    })
  }, [goToDestination])

  useEffect(() => {
    if (!request) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [request, skip])

  if (!request) return null

  return (
    <div ref={rootRef} aria-hidden="true">
      <TransitionLayer ref={refs.overlay} assets={assets} refs={refs} onSkip={skip} />
    </div>
  )
}
