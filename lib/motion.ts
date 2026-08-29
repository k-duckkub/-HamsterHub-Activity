/**
 * สปริงแยกตามประเภท interaction
 * วัตถุยิ่งใหญ่ยิ่งช้าและหนัก ปุ่มเล็กตอบสนองไวกว่าแต่ไม่เด้ง
 */

/** ราง carousel — ช้าที่สุด มีน้ำหนัก ไม่ overshoot ให้เห็น */
export const carouselSpring = {
  type: 'spring',
  stiffness: 180,
  damping: 26.5,
  mass: 1.0,
  restDelta: 0.5,
  restSpeed: 0.5,
} as const

/** การ์ดในราง */
export const cardSpring = {
  type: 'spring',
  stiffness: 180,
  damping: 26,
  mass: 0.9,
} as const

/** ปุ่มและเมนู */
export const buttonSpring = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.8,
} as const

/** พื้นหลัง Hero */
export const heroTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
} as const

/** ข้อความ Hero — สั้นกว่าพื้นหลังเล็กน้อย */
export const heroTextTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
} as const

/** ยกการ์ดขึ้นเล็กน้อย ใช้ค่าเดียวกับ ProjectCard */
export const cardHoverTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
} as const

/** Scroll story ของ Shorts: pin 300vh แล้วล็อกผลตามจุดหยุดทีละใบ */
export const shortsSequenceMotion = {
  /** เลื่อนเข้ามาถึงสัดส่วนนี้ของ section = ดึงคันโยกหนึ่งครั้ง วงล้อทุกใบออกตัวพร้อมกัน */
  triggerAmount: 0.45,
  /** ใบถัดไปหยุดช้ากว่าใบก่อนหน้าเท่านี้ (วินาที) — ปึก ปึก ปึก ทีละใบ */
  stopStagger: 0.62,
  reducedStopStagger: 0.12,
} as const

/** จังหวะวงล้อแนวตั้งของการ์ด Shorts — เลื่อนขึ้นเหมือนตู้สล็อต */
export const shortSpinMotion = {
  /** จำนวนภาพ decoy ที่ไหลผ่านก่อนหยุดที่ผลงานจริง */
  reelLength: 14,
  baseDuration: 1.9,
  indexDurationStep: 0.12,
  /** เบลอตอนวิ่งเร็ว (px) แล้วคลายเป็น 0 ตอนใกล้หยุด */
  motionBlur: 9,
  blurVelocityMax: 1800,
  speedLineCount: 7,
  speedLineOpacity: 0.42,
  speedLineTravel: ['-35%', '135%'],
  speedLineDuration: 0.32,
  speedLineDurationStep: 0.035,
  speedLineDelayStep: 0.04,
  speedLineEase: 'linear',
  speedLineRepeat: Infinity,
  spinJitterY: [0, -2, 2, -1, 1, 0],
  spinJitterTransition: {
    duration: 0.18,
    ease: 'linear',
    repeat: Infinity,
  },
  /** เด้งเลยตำแหน่งแล้วดีดกลับ หน่วยเป็น % ของความสูงการ์ด */
  overshoot: 6,
  settleDurationMs: 320,
  settleScale: 1.035,
  /** ออกตัวเร็ว แล้วหน่วงยาว ๆ ก่อนหยุด */
  ease: [0.12, 0.62, 0.16, 1],
  settleTransition: {
    type: 'spring',
    stiffness: 260,
    damping: 18,
    mass: 0.9,
  },
} as const

/** เวอร์ชันย่อเมื่อเปิด prefers-reduced-motion — ยังเลื่อนให้เห็น แต่สั้นและไม่เบลอ */
export const shortSpinMotionReduced = {
  reelLength: 3,
  baseDuration: 0.5,
  indexDurationStep: 0,
  motionBlur: 0,
  blurVelocityMax: 1,
  speedLineCount: 0,
  speedLineOpacity: 0,
  speedLineTravel: ['0%', '0%'],
  speedLineDuration: 0,
  speedLineDurationStep: 0,
  speedLineDelayStep: 0,
  speedLineEase: 'linear',
  speedLineRepeat: 0,
  spinJitterY: [0],
  spinJitterTransition: {
    duration: 0,
    ease: 'linear',
    repeat: 0,
  },
  overshoot: 0,
  settleDurationMs: 140,
  settleScale: 1.012,
  ease: [0.25, 0.1, 0.25, 1],
  settleTransition: {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    mass: 0.6,
  },
} as const

/** เหรียญรางวัลและแฟลชหลังเปิดการ์ด */
export const coinBurstMotion = {
  particleCount: 18,
  duration: 1.0,
  flashDuration: 0.2,
  flashOpacity: 0.35,
  showFlash: true,
  delayStep: 0.012,
  distanceScale: 1.55,
  rotationScale: 1,
  distanceMidpoint: 0.66,
  rotationMidpoint: 0.45,
  /** เหรียญพุ่งเข้าหาคนดู จึงโตขึ้นเรื่อย ๆ แล้วจางหาย */
  scale: [0.35, 1.25, 2.1],
  opacity: [0, 1, 0],
  times: [0, 0.3, 1],
  ease: [0.2, 0.8, 0.2, 1],
  rainCount: 12,
  rainDuration: 0.95,
  rainDurationStep: 0.045,
  rainDelayStep: 0.035,
  rainTop: ['-12%', '18%', '112%'],
  rainScale: [0.55, 0.9, 0.72],
  rainOpacity: [0, 1, 0],
  rainTimes: [0, 0.25, 1],
  rainEase: [0.28, 0.05, 0.58, 1],
  sparkleCount: 10,
  sparkleDuration: 0.62,
  sparkleDelayStep: 0.045,
  sparkleScale: [0, 1.2, 0],
  sparkleOpacity: [0, 1, 0],
  sparkleRotate: [0, 90, 180],
  sparkleTimes: [0, 0.4, 1],
} as const

/** รางวัลแบบย่อ: 6 เหรียญ ระยะครึ่งหนึ่ง และไม่มีแฟลช */
export const coinBurstMotionReduced = {
  particleCount: 6,
  duration: 0.48,
  flashDuration: 0,
  flashOpacity: 0,
  showFlash: false,
  delayStep: 0.01,
  distanceScale: 0.5,
  rotationScale: 0.55,
  distanceMidpoint: 0.72,
  rotationMidpoint: 0.5,
  scale: [0.7, 1, 0.85],
  opacity: [1, 1, 0],
  times: [0, 0.5, 1],
  ease: [0.22, 0.7, 0.25, 1],
  rainCount: 0,
  rainDuration: 0,
  rainDurationStep: 0,
  rainDelayStep: 0,
  rainTop: ['0%', '0%', '0%'],
  rainScale: [0, 0, 0],
  rainOpacity: [0, 0, 0],
  rainTimes: [0, 0.5, 1],
  rainEase: [0.22, 0.7, 0.25, 1],
  sparkleCount: 0,
  sparkleDuration: 0,
  sparkleDelayStep: 0,
  sparkleScale: [0, 0, 0],
  sparkleOpacity: [0, 0, 0],
  sparkleRotate: [0, 0, 0],
  sparkleTimes: [0, 0.5, 1],
} as const

/** จังหวะกระแทกตอนวงล้อล็อกผล */
export const lockImpactMotion = {
  duration: 0.18,
  shakeX: [0, -4, 4, -2, 2, 0],
  shakeY: [0, 2, -2, 1, 0],
  ease: 'easeOut',
  shockwaveDuration: 0.72,
  shockwaveScale: [0.96, 1.16, 1.3],
  shockwaveOpacity: [0.78, 0.34, 0],
  shockwaveTimes: [0, 0.42, 1],
  shockwaveEase: [0.2, 0.75, 0.2, 1],
} as const

/** ขอบเรืองสีเขียว "สำเร็จ" หลังเปิดการ์ดได้ */
export const winGlowMotion = {
  color: '#3DDC84',
  duration: 1.2,
  ringOpacity: [0, 0.95, 0.3, 0.85, 0],
  ringScale: [0.94, 1.06, 1, 1.04, 1],
  ease: [0.2, 0.8, 0.2, 1],
  times: [0, 0.2, 0.45, 0.68, 1],
} as const

/** รางวัลรวมเมื่อเปิดครบทั้งห้าใบ */
export const shortsCompleteMotion = {
  coinCount: 38,
  coinDuration: 1.15,
  coinDurationStep: 0.055,
  coinDelayStep: 0.024,
  coinTop: ['-8vh', '18vh', '108vh'],
  coinOpacity: [0, 1, 1, 0],
  coinScale: [0.55, 1, 0.78],
  coinTimes: [0, 0.16, 0.72, 1],
  coinEase: [0.2, 0.7, 0.25, 1],
  messageDuration: 1.25,
  messageOpacity: [0, 1, 1, 0],
  messageScale: [0.78, 1.06, 1, 1],
  messageTimes: [0, 0.18, 0.72, 1],
  messageEase: [0.2, 0.8, 0.2, 1],
} as const

/** รายละเอียดตอนเอาเมาส์ไปชี้การ์ดผลงาน — เลียนจังหวะพรีวิวของ YouTube */
export const cardPreviewMotion = {
  /** หน่วงก่อนเริ่มสไลด์ภาพ กันการ์ดกะพริบตอนลากเมาส์ผ่าน */
  startDelayMs: 320,
  /** สลับภาพถัดไปทุกกี่มิลลิวินาที */
  frameIntervalMs: 900,
  frameCount: 3,
  crossfade: 0.42,
  /** ชั้นภาพที่โผล่ซ้อนอยู่ข้างหลัง บอกว่ามีมากกว่าหนึ่งภาพ */
  stackOffset: [7, 13],
  stackScale: [0.965, 0.935],
  stackOpacity: [0.5, 0.26],
  hoverScale: 1.018,
  hoverLift: -6,
} as const

/** การ์ด Shorts ที่เปิดแล้ว ชี้เมาส์เพื่อดูรายละเอียด */
export const shortHoverMotion = {
  scale: 1.06,
  lift: -10,
  overlayDelay: 0.06,
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1],
} as const

/** CSS motion ของ skeleton และฉากหลัง footer */
export const skeletonMotion = { duration: 2.4, ease: 'linear' } as const
export const subscribeBackdropMotion = { duration: 28, ease: 'linear' } as const

/** ใช้แทนสปริงทั้งหมดเมื่อผู้ใช้เปิด prefers-reduced-motion */
export const reducedTransition = { duration: 0.15, ease: 'easeOut' } as const

export const transition = (reduced: boolean) =>
  reduced ? reducedTransition : buttonSpring
