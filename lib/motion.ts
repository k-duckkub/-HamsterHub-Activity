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

/** ใช้แทนสปริงทั้งหมดเมื่อผู้ใช้เปิด prefers-reduced-motion */
export const reducedTransition = { duration: 0.15, ease: 'easeOut' } as const

export const transition = (reduced: boolean) =>
  reduced ? reducedTransition : buttonSpring
