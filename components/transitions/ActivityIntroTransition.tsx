'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { markIntroSeen, onIntroRequest, type IntroRequest } from '@/lib/activityIntro'
import TransitionLayer, { type IntroRefs } from './TransitionLayer'
import { INTRO_SOUNDS, useActivityIntro } from './useActivityIntro'

/** เวลาบนไทม์ไลน์ (วินาที) — ยาวรวม 4.32s เว้นจังหวะให้เป็นคัตซีนได้จริง */
const T = {
  /** ไฟคลุมจอสนิทตรงนี้ จึงเป็นจุดที่ซ่อนการเปลี่ยน route ได้ */
  routeChange: 2.16,
  /** ควันเริ่มคลายออก เผยหน้าปลายทาง */
  reveal: 3.88,
  total: 4.7,
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
    stage: useRef<HTMLDivElement>(null),
    barTop: useRef<HTMLDivElement>(null),
    barBottom: useRef<HTMLDivElement>(null),
    light: useRef<HTMLDivElement>(null),
    vignette: useRef<HTMLDivElement>(null),
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
    [hasSound, muted],
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

    /**
     * เรนเดอร์หน้าปลายทางกินเมนเธรดเป็นช่วง ๆ ค่า lagSmoothing ปกติ (1000ms)
     * จะปล่อยให้ไทม์ไลน์กระโดดข้ามตามเวลาจริง จังหวะสำคัญอย่างตอนถูกจับจึงหายไปเลย
     * บีบให้ช่องว่างเกิน 120ms นับเป็น 20ms แทน ฉากจะเดินครบทุกจังหวะ
     */
    gsap.ticker.lagSmoothing(120, 20)

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
      const stage = refs.stage.current
      const light = refs.light.current

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

      /** สั่นกล้องแบบลดแรงลงเรื่อย ๆ ไม่ใช่สั่นเท่ากันทุกครั้ง */
      const shake = (at: number, strength: number, times: number, each = 0.055) => {
        if (!stage) return
        for (let i = 0; i < times; i += 1) {
          const decay = strength * (1 - i / times)
          timeline.to(
            stage,
            {
              x: (i % 2 === 0 ? -1 : 1) * decay,
              y: (i % 3 === 0 ? 1 : -1) * decay * 0.6,
              duration: each,
              ease: 'sine.inOut',
            },
            at + i * each,
          )
        }
        timeline.to(
          stage,
          { x: 0, y: 0, duration: each * 1.6, ease: 'sine.out' },
          at + times * each,
        )
      }

      // ── เปิดฉาก: ม่านทึบ แถบดำ ขอบมืด แล้วกล้องค่อย ๆ เคลื่อน ────────────
      timeline
        .fromTo(refs.shade.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 0)
        .fromTo(
          refs.barTop.current,
          // ต้องล้าง y ด้วย เพราะ GSAP อ่าน translateY(-100%) จาก inline style เป็นพิกเซล
          // ถ้าปล่อยไว้ แถบจะบวกค่าเดิมแล้วจบนอกจอตลอด
          { y: 0, yPercent: -100 },
          { y: 0, yPercent: 0, duration: 0.42, ease: 'power3.out' },
          0.06,
        )
        .fromTo(
          refs.barBottom.current,
          { y: 0, yPercent: 100 },
          { y: 0, yPercent: 0, duration: 0.42, ease: 'power3.out' },
          0.06,
        )
        .fromTo(
          refs.vignette.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
          0.06,
        )
        .fromTo(refs.skip.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 0.7)

      if (stage) {
        // กล้องไหลเข้าช้า ๆ ตลอดองก์แรก ภาพจึงไม่เคยนิ่งสนิท
        timeline.fromTo(
          stage,
          { scale: 1.14, transformOrigin: '30% 62%' },
          { scale: 1.04, duration: 1.5, ease: 'sine.inOut' },
          0.06,
        )
      }

      // ── องก์ 1 เดินเข้าฉาก ──────────────────────────────────────────────
      if (dinosaur) {
        timeline
          .fromTo(
            dinosaur,
            {
              xPercent: -128,
              yPercent: 18,
              rotate: -8,
              scale: 0.86,
              autoAlpha: 0,
            },
            {
              xPercent: -8,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.78,
              ease: 'power2.out',
            },
            0.14,
          )
          // สองก้าวสุดท้าย ลงน้ำหนักเท้าแล้วกระเด้งขึ้น
          .to(dinosaur, { yPercent: -3.2, duration: 0.16, ease: 'sine.out' }, 0.52)
          .to(dinosaur, { yPercent: 0, duration: 0.18, ease: 'sine.in' }, 0.68)
          .to(dinosaur, { yPercent: -2.2, duration: 0.14, ease: 'sine.out' }, 0.86)
          .to(dinosaur, { yPercent: 0, duration: 0.16, ease: 'sine.in' }, 1.0)

          // ── องก์ 2 หันมาเห็นคนดู แล้วสูดลม ────────────────────────────
          .to(dinosaur, { xPercent: -2, duration: 0.24, ease: 'power2.out' }, 1.16)
          // ถอยหัวกลับ พองตัว ค้างไว้หนึ่งจังหวะก่อนพ่น
          .to(
            dinosaur,
            {
              xPercent: -9,
              scaleX: 1.07,
              scaleY: 0.95,
              duration: 0.3,
              ease: 'power2.out',
            },
            1.4,
          )
          .to({}, { duration: 0.16 }, 1.7)
      }

      if (stage) {
        // กล้องกระชากเข้าใกล้ตอนสูดลม แล้วถอยออกทันทีที่ไฟออก
        timeline
          .to(stage, { scale: 1.2, duration: 0.34, ease: 'power2.in' }, 1.4)
          .to(stage, { scale: 1.02, duration: 0.5, ease: 'power3.out' }, 1.78)
      }

      // ── องก์ 3 พ่นไฟ ─────────────────────────────────────────────────
      if (fire) {
        timeline
          .call(() => play(INTRO_SOUNDS.fire), [], 1.8)
          .fromTo(
            fire,
            {
              autoAlpha: 0,
              scaleX: 0.1,
              scaleY: 0.3,
              // จุดกำเนิดอยู่แถวปากมังกร ไฟจึงงอกออกจากตัวมันจริง ๆ
              transformOrigin: '20% 52%',
            },
            {
              autoAlpha: 1,
              scaleX: 1,
              scaleY: 1,
              duration: 0.36,
              ease: 'power2.out',
            },
            1.8,
          )
          // เปลวไฟหายใจอยู่ตลอด ไม่ใช่ภาพนิ่งที่ถูกยืด
          .to(
            fire,
            {
              scaleY: 1.07,
              duration: 0.17,
              repeat: 7,
              yoyo: true,
              ease: 'sine.inOut',
              transformOrigin: '20% 52%',
            },
            2.16,
          )
          .to(fire, { scale: 1.85, duration: 0.8, ease: 'power2.in' }, 2.0)
      }

      if (light) {
        // แสงไฟสาดใส่ทั้งฉาก วูบตามจังหวะเปลว แล้วค่อยหรี่ลงเมื่อไฟจะดับ
        timeline
          .fromTo(light, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 1.8)
          .to(
            light,
            {
              autoAlpha: 0.68,
              duration: 0.13,
              repeat: 8,
              yoyo: true,
              ease: 'sine.inOut',
            },
            2.06,
          )
          .to(light, { autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, 3.0)
      }

      if (dinosaur) {
        // แรงสะท้อนจากการพ่น สั่นถี่ ๆ อยู่กับที่
        timeline
          .to(dinosaur, { scaleX: 0.98, scaleY: 1.03, duration: 0.26, ease: 'power2.out' }, 1.8)
          .to(
            dinosaur,
            {
              xPercent: -13,
              duration: 0.09,
              repeat: 11,
              yoyo: true,
              ease: 'sine.inOut',
            },
            1.86,
          )
      }

      // กล้องสั่นตอนไฟพุ่งออก
      shake(1.82, 14, 6)

      // เปลี่ยนหน้าตอนไฟคลุมจอสนิท
      timeline.call(goToDestination, [], T.routeChange)

      // ── องก์ 4 เงาบางอย่างลงมาจากข้างบน ───────────────────────────────
      if (hand) {
        timeline
          .fromTo(
            hand,
            { xPercent: 52, yPercent: -128, rotate: 16, autoAlpha: 0 },
            {
              // ภาพแฮมสเตอร์ถูกตัดขอบขวาไว้ให้อยู่มุมจอ เลื่อนเข้ากลางจอจะเห็นรอยตัด
              // จึงให้มือหยุดใกล้มุมเดิม แล้วดึงมังกรเข้าหาอุ้งมือแทน
              xPercent: 0,
              yPercent: 8,
              rotate: -2,
              autoAlpha: 1,
              duration: 0.42,
              ease: 'power4.out',
            },
            2.28,
          )
          // เลยไปนิดแล้วถอยกลับ ให้รู้สึกว่ามีน้ำหนัก
          .to(hand, { yPercent: 4, rotate: 0, duration: 0.2, ease: 'power2.out' }, 2.7)
      }

      if (stage) {
        // กล้องเงยตามมือที่ลงมา แล้วกระแทกลงตอนจับติด
        timeline
          .to(stage, { scale: 1.08, yPercent: 2, duration: 0.4, ease: 'power2.out' }, 2.3)
          .to(stage, { yPercent: 0, duration: 0.3, ease: 'power2.inOut' }, 2.74)
      }

      if (dinosaur) {
        // ยกชั้นมังกรขึ้นมาหน้าเปลวไฟตอนถูกจับ ไม่งั้นภาพสำคัญที่สุดจะโดนไฟบัง
        timeline.set(dinosaur, { zIndex: 1035 }, 2.66)
        timeline
          // ── องก์ 5 ถูกจับ ──────────────────────────────────────────────
          // ถูกกระชากเข้าหาอุ้งมือตามระยะที่วัดได้จริง พร้อมยุบตัวตอนโดนบีบ
          .to(
            dinosaur,
            {
              x: grab.x,
              y: grab.y,
              scale: 0.9,
              rotate: 8,
              duration: 0.24,
              ease: 'power3.inOut',
            },
            2.72,
          )
          .call(() => play(INTRO_SOUNDS.grab), [], 2.86)
          // ค้างภาพไว้ให้คนดูทัน แล้วดิ้นสองที
          .to({}, { duration: 0.14 }, 2.96)
          .to(
            dinosaur,
            {
              rotate: -3,
              duration: 0.08,
              repeat: 5,
              yoyo: true,
              ease: 'sine.inOut',
            },
            3.02,
          )
      }

      // กระแทกสั้น ๆ ตอนอุ้งมือปิด
      shake(2.86, 9, 4, 0.05)

      // ── องก์ 6 ยกออกจากฉาก ───────────────────────────────────────────
      const lifted = [dinosaur, hand].filter((node): node is HTMLDivElement => node !== null)
      if (lifted.length > 0) {
        // ยกเป็นพิกเซล ทั้งคู่จึงเคลื่อนเท่ากันเป๊ะ และไม่หลุดจากกันระหว่างทาง
        timeline.to(
          lifted,
          {
            x: `+=${Math.round(viewport.w * 0.2)}`,
            y: `-=${Math.round(viewport.h * 0.95)}`,
            duration: 0.62,
            ease: 'power2.in',
          },
          3.24,
        )
      }

      if (dinosaur) {
        // ห้อยอยู่ในมือ แกว่งตามแรงยก
        timeline.to(dinosaur, { rotate: 17, duration: 0.62, ease: 'sine.inOut' }, 3.24)
      }

      if (stage) {
        // กล้องเงยตามขึ้นไปนิดหนึ่ง แล้วคลายกลับสู่ขนาดปกติตอนม่านเปิด
        timeline
          .to(stage, { yPercent: -3, duration: 0.5, ease: 'power2.out' }, 3.24)
          .to(stage, { scale: 1, yPercent: 0, duration: 0.7, ease: 'power2.out' }, T.reveal)
      }

      // ── องก์ 7 ไฟดับ กลายเป็นควัน ─────────────────────────────────────
      if (fire) {
        timeline
          // ไฟสะดุดสั้น ๆ ตอนต้นทางถูกยกออกไป ก่อนจะดับจริง
          .to(fire, { scaleY: 0.92, duration: 0.12, ease: 'power2.in' }, 3.04)
          .to(fire, { autoAlpha: 0, scale: 2, duration: 0.6, ease: 'power2.out' }, 3.16)
      }

      if (smoke) {
        timeline
          .fromTo(
            smoke,
            { autoAlpha: 0, scale: 0.9, rotate: -1.5 },
            {
              autoAlpha: 1,
              scale: 1,
              rotate: 0,
              duration: 0.36,
              ease: 'power2.out',
            },
            3.1,
          )
          // ควันคลายออกจากกลางจอสู่ขอบ เผยหน้าปลายทางทีละส่วน
          .to(
            smoke,
            {
              autoAlpha: 0,
              scale: 1.4,
              rotate: 2,
              duration: 0.8,
              ease: 'power2.out',
            },
            T.reveal,
          )
      }

      // ── องก์ 8 ม่านเปิด แถบดำเก็บ ─────────────────────────────────────
      timeline
        .call(() => play(INTRO_SOUNDS.reveal), [], T.reveal)
        .to(refs.shade.current, { autoAlpha: 0, duration: 0.62, ease: 'power2.out' }, T.reveal)
        .to(refs.vignette.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, T.reveal)
        .to(
          refs.barTop.current,
          { yPercent: -100, duration: 0.5, ease: 'power3.inOut' },
          T.reveal + 0.1,
        )
        .to(
          refs.barBottom.current,
          { yPercent: 100, duration: 0.5, ease: 'power3.inOut' },
          T.reveal + 0.1,
        )
        .call(
          () => {
            const page = document.querySelector<HTMLElement>('main')
            if (!page) return
            gsap.fromTo(
              page,
              { scale: 1.012, filter: 'brightness(0.86)' },
              {
                scale: 1,
                filter: 'brightness(1)',
                duration: 0.62,
                ease: 'power2.out',
              },
            )
          },
          [],
          T.reveal,
        )

      // ประกายไฟลอยขึ้นแล้วดับทีละเม็ด ไม่ใช่หายพร้อมกันทั้งกลุ่ม
      const sparks = refs.sparks.current?.children
      if (sparks && sparks.length > 0) {
        timeline.to(
          sparks,
          {
            y: -30,
            autoAlpha: 0,
            duration: 0.52,
            ease: 'power1.out',
            stagger: { each: 0.06, from: 'random' },
          },
          T.reveal + 0.12,
        )
      }

      timeline
        .to(refs.skip.current, { autoAlpha: 0, duration: 0.18 }, T.reveal + 0.2)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.16 }, T.total - 0.16)

      // ถ้าหน้าปลายทางยังไม่มา ให้ไฟค้างต่อได้อีกไม่เกิน 0.8s แล้วเดินหน้าต่อ
      timeline.call(
        () => {
          if (document.querySelector('main')) return
          timeline.pause()
          window.setTimeout(() => timeline.play(), MAX_FIRE_HOLD * 1000)
        },
        [],
        T.reveal - 0.02,
      )
    }, rootRef)

    return () => {
      timelineRef.current = null
      context.revert()
      // หยุดวิดีโอก่อนถอด overlay ออก
      rootRef.current?.querySelectorAll('video').forEach((video) => video.pause())
    }
  }, [
    request,
    ready,
    finish,
    goToDestination,
    play,
    refs.barBottom,
    refs.barTop,
    refs.dinosaur,
    refs.fire,
    refs.hand,
    refs.light,
    refs.shade,
    refs.skip,
    refs.smoke,
    refs.sparks,
    refs.stage,
    refs.vignette,
  ])

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
