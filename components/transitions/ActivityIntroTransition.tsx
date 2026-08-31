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
  /** ไฟคลุมจอสนิทตรงนี้ จึงเป็นจุดที่ซ่อนการเปลี่ยน route ได้ */
  routeChange: 1.62,
  /** ควันเริ่มคลายออก เผยหน้าปลายทาง */
  reveal: 2.4,
  total: 3.0,
} as const

/** ไฟค้างได้อีกไม่เกินเท่านี้ถ้าหน้าปลายทางยังไม่พร้อม */
const MAX_FIRE_HOLD = 0.8

const VOLUME = 0.35

export default function ActivityIntroTransition() {
  const router = useRouter()
  const [request, setRequest] = useState<IntroRequest | null>(null)
  // overlay อยู่ใน layout ทุกหน้า จึงตรวจไฟล์ต่อเมื่อมีการเรียกอินโทรจริง
  const { assets, ready, checked, muted, hasSound, checkSounds } = useActivityIntro({
    enabled: request !== null,
  })

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

  // ตรวจไฟล์เสียงเมื่ออินโทรจะเล่นจริงเท่านั้น
  useEffect(() => {
    if (request) void checkSounds()
  }, [checkSounds, request])

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

  // ไฟล์ไม่ครบก็ไปหน้าปลายทางเลย ดีกว่าค้างม่านทึบไว้เฉย ๆ
  useEffect(() => {
    if (!request || !checked || ready) return
    goToDestination()
    setRequest(null)
  }, [checked, goToDestination, ready, request])

  useLayoutEffect(() => {
    if (!request || !ready) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      })
      timelineRef.current = timeline
      timeline.addLabel('reveal', T.reveal)

      const dinosaur = refs.dinosaur.current
      const hand = refs.hand.current
      const fire = refs.fire.current
      const smoke = refs.smoke.current

      /**
       * ระยะที่มังกรต้องขยับไปให้พอดีอุ้งมือ วัดจากกล่องจริงของภาพทั้งสอง
       * จะได้ลงตำแหน่งถูกทุกขนาดจอ ไม่ใช่ค่าคงที่ที่ดีเฉพาะบนเดสก์ท็อป
       */
      const grabOffset = (): { x: number; y: number } => {
        const dinoBox = dinosaur?.querySelector('img')?.getBoundingClientRect()
        const handBox = hand?.querySelector('img')?.getBoundingClientRect()
        if (!dinoBox || !handBox) return { x: 0, y: 0 }

        // อุ้งมืออยู่ราวหนึ่งในสี่จากซ้ายและสามในสี่จากบนของภาพแฮมสเตอร์
        const paw = {
          x: handBox.left + handBox.width * 0.25,
          y: handBox.top + handBox.height * 0.78,
        }
        const dino = {
          x: dinoBox.left + dinoBox.width * 0.5,
          y: dinoBox.top + dinoBox.height * 0.55,
        }
        return { x: Math.round(paw.x - dino.x), y: Math.round(paw.y - dino.y) }
      }

      const grab = grabOffset()
      const viewport = { w: window.innerWidth, h: window.innerHeight }

      // ม่านทึบขึ้นก่อน แล้วค่อยเป็นฉากของตัวละคร
      timeline
        .fromTo(refs.shade.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 0)
        .fromTo(refs.skip.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.5)

      // ── องก์ 1 เดินเข้าฉาก ──────────────────────────────────────────────
      if (dinosaur) {
        timeline
          .fromTo(
            dinosaur,
            { xPercent: -118, yPercent: 16, rotate: -7, scale: 0.9, autoAlpha: 0 },
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.08
          )
          // ก้าวสุดท้ายกระเด้งนิดหนึ่ง เหมือนลงน้ำหนักเท้า
          .to(dinosaur, { yPercent: -2.5, duration: 0.14, ease: 'sine.out' }, 0.44)
          .to(dinosaur, { yPercent: 0, duration: 0.16, ease: 'sine.in' }, 0.58)

          // ── องก์ 2 สูดลม ───────────────────────────────────────────────
          // ถอยหัวกลับ พองตัว แล้วค้างไว้ให้คนดูรู้ว่ากำลังจะมีอะไรเกิดขึ้น
          .to(
            dinosaur,
            { xPercent: -4, scaleX: 1.05, scaleY: 0.96, duration: 0.2, ease: 'power2.out' },
            0.62
          )
          .to({}, { duration: 0.12 }, 0.82)
      }

      // ── องก์ 3 พ่นไฟ ─────────────────────────────────────────────────
      if (fire) {
        timeline
          .call(() => play(INTRO_SOUNDS.fire), [], 0.94)
          .fromTo(
            fire,
            {
              autoAlpha: 0,
              scaleX: 0.12,
              scaleY: 0.34,
              // จุดกำเนิดอยู่แถวปากมังกร ไฟจึงงอกออกจากตัวมันจริง ๆ
              transformOrigin: '20% 52%',
            },
            { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.34, ease: 'power2.out' },
            0.94
          )
          // เปลวไฟหายใจอยู่ตลอด ไม่ใช่ภาพนิ่งที่ถูกยืด
          .to(
            fire,
            {
              scaleY: 1.06,
              duration: 0.16,
              repeat: 6,
              yoyo: true,
              ease: 'sine.inOut',
              transformOrigin: '20% 52%',
            },
            1.28
          )
          .to(fire, { scale: 1.75, duration: 0.62, ease: 'power2.in' }, 1.24)
      }

      if (dinosaur) {
        // แรงสะท้อนจากการพ่น สั่นถี่ ๆ อยู่กับที่
        timeline
          .to(
            dinosaur,
            { scaleX: 0.99, scaleY: 1.02, duration: 0.24, ease: 'power2.out' },
            0.94
          )
          .to(
            dinosaur,
            { xPercent: -6, duration: 0.08, repeat: 9, yoyo: true, ease: 'sine.inOut' },
            0.98
          )
      }

      // เปลี่ยนหน้าตอนไฟคลุมจอสนิท
      timeline.call(goToDestination, [], T.routeChange)

      // ── องก์ 4 มือลงมา ────────────────────────────────────────────────
      if (hand) {
        timeline
          .fromTo(
            hand,
            { xPercent: 46, yPercent: -118, rotate: 14, autoAlpha: 0 },
            {
              // ภาพแฮมสเตอร์ถูกตัดขอบขวาไว้ให้อยู่มุมจอ เลื่อนเข้ากลางจอจะเห็นรอยตัด
              // จึงให้มือหยุดใกล้มุมเดิม แล้วดึงมังกรเข้าหาอุ้งมือแทน
              xPercent: 0,
              yPercent: 8,
              rotate: -2,
              autoAlpha: 1,
              duration: 0.34,
              ease: 'power4.out',
            },
            1.5
          )
          // เลยไปนิดแล้วถอยกลับ ให้รู้สึกว่ามีน้ำหนัก
          .to(hand, { yPercent: 4, rotate: 0, duration: 0.16, ease: 'power2.out' }, 1.84)
      }

      if (dinosaur) {
        timeline
          // ── องก์ 5 ถูกจับ ──────────────────────────────────────────────
          // ถูกยกลอยขึ้นเข้าหาอุ้งมือ พร้อมยุบตัวนิดหนึ่งตอนโดนจับ
          .to(
            dinosaur,
            {
              // ถูกกระชากเข้าหาอุ้งมือตามระยะที่วัดได้จริง
              x: grab.x,
              y: grab.y,
              scale: 0.93,
              rotate: 6,
              duration: 0.2,
              ease: 'power2.inOut',
            },
            1.8
          )
          .call(() => play(INTRO_SOUNDS.grab), [], 1.9)
          // ค้างภาพไว้ให้คนดูทัน แล้วดิ้นสองที
          .to({}, { duration: 0.1 }, 2.0)
          .to(
            dinosaur,
            { rotate: -2, duration: 0.07, repeat: 3, yoyo: true, ease: 'sine.inOut' },
            2.06
          )
      }

      // ── องก์ 6 ยกออกจากฉาก ───────────────────────────────────────────
      const lifted = [dinosaur, hand].filter(
        (node): node is HTMLDivElement => node !== null
      )
      if (lifted.length > 0) {
        // ยกเป็นพิกเซล ทั้งคู่จึงเคลื่อนเท่ากันเป๊ะ และไม่หลุดจากกันระหว่างทาง
        timeline.to(
          lifted,
          {
            x: `+=${Math.round(viewport.w * 0.2)}`,
            y: `-=${Math.round(viewport.h * 0.95)}`,
            duration: 0.5,
            ease: 'power2.in',
          },
          2.2
        )
      }

      if (dinosaur) {
        // ห้อยอยู่ในมือ แกว่งตามแรงยก
        timeline.to(dinosaur, { rotate: 15, duration: 0.5, ease: 'sine.inOut' }, 2.2)
      }

      // ── องก์ 7 ไฟดับ กลายเป็นควัน ─────────────────────────────────────
      if (fire) {
        timeline
          // ไฟสะดุดสั้น ๆ ตอนต้นทางถูกยกออกไป ก่อนจะดับจริง
          .to(fire, { scaleY: 0.94, duration: 0.1, ease: 'power2.in' }, 2.06)
          .to(fire, { autoAlpha: 0, scale: 1.9, duration: 0.5, ease: 'power2.out' }, 2.16)
      }

      if (smoke) {
        timeline
          .fromTo(
            smoke,
            { autoAlpha: 0, scale: 0.92, rotate: -1.5 },
            { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' },
            2.1
          )
          // ควันคลายออกจากกลางจอสู่ขอบ เผยหน้าปลายทางทีละส่วน
          .to(
            smoke,
            { autoAlpha: 0, scale: 1.35, rotate: 2, duration: 0.72, ease: 'power2.out' },
            T.reveal
          )
      }

      // ── องก์ 8 ม่านเปิด ──────────────────────────────────────────────
      timeline
        .call(() => play(INTRO_SOUNDS.reveal), [], 2.4)
        .to(refs.shade.current, { autoAlpha: 0, duration: 0.56, ease: 'power2.out' }, T.reveal)
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

      // ประกายไฟลอยขึ้นแล้วดับทีละเม็ด ไม่ใช่หายพร้อมกันทั้งกลุ่ม
      const sparks = refs.sparks.current?.children
      if (sparks && sparks.length > 0) {
        timeline.to(
          sparks,
          {
            y: -26,
            autoAlpha: 0,
            duration: 0.46,
            ease: 'power1.out',
            stagger: { each: 0.05, from: 'random' },
          },
          2.52
        )
      }

      timeline
        .to(refs.skip.current, { autoAlpha: 0, duration: 0.16 }, 2.6)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.14 }, 2.86)

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
  }, [request, ready, finish, goToDestination, play, refs.dinosaur, refs.fire, refs.hand, refs.shade, refs.skip, refs.smoke, refs.sparks])

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
