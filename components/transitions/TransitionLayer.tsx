'use client'

import { forwardRef, type RefObject } from 'react'
import type { IntroAssets } from './useActivityIntro'
import TransparentVideo from './TransparentVideo'

export type IntroRefs = {
  overlay: RefObject<HTMLDivElement>
  shade: RefObject<HTMLDivElement>
  dinosaur: RefObject<HTMLDivElement>
  fire: RefObject<HTMLDivElement>
  smoke: RefObject<HTMLDivElement>
  hand: RefObject<HTMLDivElement>
  sparks: RefObject<HTMLDivElement>
  skip: RefObject<HTMLDivElement>
  /** กล้อง: ครอบทุกชั้นของฉาก ขยับ/ซูมได้โดยไม่ยุ่งกับ transform ของตัวละคร */
  stage: RefObject<HTMLDivElement>
  /** แถบดำบน–ล่างแบบคัตซีน */
  barTop: RefObject<HTMLDivElement>
  barBottom: RefObject<HTMLDivElement>
  /** แสงไฟที่สาดใส่ทั้งฉากตอนมังกรพ่นไฟ */
  light: RefObject<HTMLDivElement>
  /** ขอบมืดรอบจอ ให้ภาพดูเป็นฉากไม่ใช่ภาพแปะ */
  vignette: RefObject<HTMLDivElement>
}

type TransitionLayerProps = {
  assets: IntroAssets
  refs: IntroRefs
  onSkip: () => void
}

/** ประกายไฟที่เหลือหลังควันจาง — จุดกลม ๆ วางกระจายแบบคงที่ ไม่สุ่มทุกเฟรม */
const SPARKS = [
  { left: '38%', top: '46%', size: 6 },
  { left: '52%', top: '38%', size: 4 },
  { left: '61%', top: '55%', size: 7 },
  { left: '46%', top: '62%', size: 5 },
  { left: '69%', top: '44%', size: 4 },
  { left: '33%', top: '58%', size: 5 },
]

const LAYER = 'activity-intro-layer absolute inset-0'

/** ชั้นภาพทั้งหมดของอินโทร — ไม่มี logic เวลา ปล่อยให้ GSAP เป็นคนสั่ง */
const TransitionLayer = forwardRef<HTMLDivElement, TransitionLayerProps>(function TransitionLayer(
  { assets, refs, onSkip },
  ref,
) {
  return (
    <div ref={ref} className="fixed inset-0 z-[1000]">
      {/* ชั้นบังหน้าปลายทางระหว่างเปลี่ยน route */}
      <div
        ref={refs.shade}
        aria-hidden="true"
        className={`${LAYER} z-[1000] bg-[#0D1117]`}
        style={{ opacity: 0 }}
      />

      <div ref={refs.stage} aria-hidden="true" className={`${LAYER} z-[1005]`}>
        {assets.dinosaur && (
          <div
            ref={refs.dinosaur}
            aria-hidden="true"
            className={`${LAYER} z-[1010] flex items-center justify-start p-[6vmin]`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.dinosaur}
              alt=""
              draggable={false}
              // ตัวมังกรกินพื้นที่ราวครึ่งหนึ่งของภาพ จึงต้องตั้งกรอบให้กว้างกว่าขนาดที่อยากเห็น
              className="h-auto w-[104%] max-w-none object-contain sm:w-[64%]"
            />
          </div>
        )}

        {assets.fire && (
          <TransparentVideo
            ref={refs.fire}
            src={assets.fire}
            className={`${LAYER} z-[1020]`}
            loop
          />
        )}

        {assets.smoke && (
          <TransparentVideo ref={refs.smoke} src={assets.smoke} className={`${LAYER} z-[1030]`} />
        )}

        {assets.hand && (
          <div
            ref={refs.hand}
            aria-hidden="true"
            className={`${LAYER} z-[1040] flex items-start justify-end`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.hand}
              alt=""
              draggable={false}
              className="h-auto w-[78%] object-contain sm:w-[46%]"
            />
          </div>
        )}

        <div ref={refs.sparks} aria-hidden="true" className={`${LAYER} z-[1050]`}>
          {SPARKS.map((spark, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-[#FFB068]"
              style={{
                left: spark.left,
                top: spark.top,
                width: spark.size,
                height: spark.size,
                boxShadow: '0 0 12px rgba(255, 176, 104, 0.9)',
              }}
            />
          ))}
        </div>
      </div>

      {/* แสงจากเปลวไฟสาดทั่วฉาก และเงามืดรอบขอบจอ */}
      <div
        ref={refs.light}
        aria-hidden="true"
        className={`${LAYER} z-[1055]`}
        style={{
          opacity: 0,
          background:
            'radial-gradient(120% 90% at 22% 58%, rgba(255,186,110,0.55) 0%, rgba(255,122,46,0.28) 38%, rgba(255,122,46,0) 70%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={refs.vignette}
        aria-hidden="true"
        className={`${LAYER} z-[1056]`}
        style={{
          opacity: 0,
          background:
            'radial-gradient(115% 85% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* แถบดำบน–ล่าง สัญญะของคัตซีน */}
      <div
        ref={refs.barTop}
        aria-hidden="true"
        className="activity-intro-bar absolute inset-x-0 top-0 z-[1058] bg-black"
        style={{ height: '11vh', transform: 'translateY(-100%)' }}
      />
      <div
        ref={refs.barBottom}
        aria-hidden="true"
        className="activity-intro-bar absolute inset-x-0 bottom-0 z-[1058] bg-black"
        style={{ height: '11vh', transform: 'translateY(100%)' }}
      />

      {/* ปุ่มข้ามเป็นชั้นเดียวที่รับคลิก และไม่ถูกซ่อนจาก screen reader */}
      <div
        ref={refs.skip}
        className="pointer-events-none absolute right-0 top-0 z-[1060] p-4"
        style={{
          opacity: 0,
          paddingTop: 'calc(1rem + env(safe-area-inset-top))',
          paddingRight: 'calc(1rem + env(safe-area-inset-right))',
        }}
      >
        <button
          type="button"
          onClick={onSkip}
          aria-label="ข้ามแอนิเมชันเข้าสู่รายละเอียดกิจกรรม"
          className="pointer-events-auto rounded-full bg-black/55 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ข้าม
        </button>
      </div>
    </div>
  )
})

export default TransitionLayer
