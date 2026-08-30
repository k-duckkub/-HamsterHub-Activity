/** ค่ากลางของการปัดเปลี่ยนหน้า ใช้ร่วมกันทั้งหน้า 2 และหน้า 3 */

/** เริ่มจับ swipe เมื่อแนวนอนชัดกว่าแนวตั้งพอสมควรเท่านั้น */
export const swipeIntent = {
  minDistance: 10,
  horizontalRatio: 1.25,
} as const

export const swipeThreshold = {
  /** สัดส่วนของความกว้างจอที่ถือว่าปัดสำเร็จ */
  distanceRatio: 0.22,
  /** ปัดเร็วพอก็ผ่านได้แม้ระยะไม่ถึง (px/s) */
  velocity: 650,
  /** แต่ต้องลากอย่างน้อยเท่านี้เสมอ */
  minDistance: 48,
} as const

/**
 * ปัดสำเร็จ — เลื่อนแผ่นทั้งคู่ไปตำแหน่งสุดท้ายรวดเดียว
 * ใช้ tween สั้น ๆ แทนสปริง เพราะปลายทางต้องหยุดนิ่งพอดีก่อนสลับ route
 * (สปริงมีหางสั่นยาว ทำให้เห็นรอยต่อตอนเปลี่ยนหน้า)
 */
export const swipeCommitSpring = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1],
} as const

/** ปัดไม่ถึงเกณฑ์ — คืนที่เดิมแบบไม่เด้ง */
export const swipeReturnSpring = {
  duration: 0.26,
  ease: [0.22, 1, 0.36, 1],
} as const

export const pageEnter = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} as const

export const tutorialSequence = {
  initialDelay: 450,
  dragDuration: 0.72,
  holdDuration: 0.18,
  returnDuration: 0.52,
  repeatDelay: 0.55,
  repeat: 2,
  /** หน้าเนื้อหาขยับตามการสาธิตเท่านี้ */
  pagePeek: 20,
} as const

/**
 * element ที่ห้ามใช้เป็นจุดเริ่มปัดเปลี่ยนหน้า
 * ปุ่มกับลิงก์ไม่อยู่ในรายการนี้ เพราะหน้าผลงานเต็มไปด้วยการ์ดที่เป็นปุ่ม
 * การแตะยังไม่ถูกแย่ง เพราะต้องลากเกิน 10px และแนวนอนชัดกว่าแนวตั้งจึงเริ่มปัด
 */
export const NO_SWIPE_SELECTOR =
  'input, textarea, select, [role="listbox"], [data-no-page-swipe]'
