import { spaces, type Space } from './spaces'

/**
 * 5 พื้นที่สำคัญสำหรับหน้า Explore แบบไม่มีข้อความ
 * เกณฑ์: ผู้รับชมสูงสุด แล้วเรียงตามลำดับเดิมใน spaces.ts
 */
const FEATURED_IDS = [
  'gamedev-tournament',
  'gamejam-international',
  'gamejam-x',
  'nuutor-cup',
  'roblox-jam',
] as const

export const featuredSpaces: Space[] = FEATURED_IDS.map((id) => {
  const space = spaces.find((item) => item.id === id)
  if (!space) throw new Error(`Unknown featured space: ${id}`)
  return space
})
