export const SOFT_SPRING = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
  mass: 0.75,
}

export const GENTLE_SPRING = {
  type: 'spring',
  stiffness: 210,
  damping: 28,
  mass: 0.9,
}

/** ใช้แทน spring เมื่อผู้ใช้เปิด prefers-reduced-motion */
export const REDUCED = { duration: 0.18, ease: 'easeOut' }

export const t = (reduced, spring = SOFT_SPRING) => (reduced ? REDUCED : spring)
