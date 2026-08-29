/** สปริงหลักของทั้งหน้า — นุ่ม มีน้ำหนัก คืนตัวโดยไม่เด้งแรง */
export const softSpring = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
  mass: 0.75,
} as const

/** ใช้แทนสปริงทั้งหมดเมื่อผู้ใช้เปิด prefers-reduced-motion */
export const reducedTransition = { duration: 0.15, ease: 'easeOut' } as const

export const transition = (reduced: boolean) =>
  reduced ? reducedTransition : softSpring
