/** เมนูหลักของเว็บ ใช้ร่วมกันทั้งแถบบนและเมนูมือถือ */
export type NavItem = {
  label: string
  /** ปลายทางจริง ถ้ายังไม่มีหน้านั้นให้เป็น null แล้วขึ้นว่า “เร็ว ๆ นี้” */
  href: string | null
  /** ปุ่มเน้นแบบ CTA */
  emphasis?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: null },
  { label: 'Course', href: null },
  { label: 'HamStore', href: null },
  { label: 'Activity', href: '/explore' },
  { label: 'Profile', href: null },
  { label: 'About', href: null },
]

/** ปุ่มขวาสุดของแถบบน — พาไปหน้ารวมผลงานที่มีอยู่จริง */
export const SHOWCASE_ITEM: NavItem = {
  label: 'Project Showcase',
  href: '/projects',
  emphasis: true,
}

export const COMING_SOON = 'เร็ว ๆ นี้'
