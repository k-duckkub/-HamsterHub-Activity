import { activities, type Activity } from './activities'

/**
 * กิจกรรมที่ขึ้นหน้า Explore
 * เรียงกิจกรรมที่มีโปสเตอร์จริงไว้ก่อน หน้าแรกจะได้เป็นภาพจริงทั้งแถว
 * ถ้ายังไม่มีโปสเตอร์ครบ ก็เติมด้วยกิจกรรมที่เหลือให้ครบอย่างน้อย 5 ใบ
 */
const withCover = activities.filter((activity) => activity.space.coverImage)
const withoutCover = activities.filter((activity) => !activity.space.coverImage)

export const featuredActivities: Activity[] = [
  ...withCover,
  ...withoutCover.slice(0, Math.max(0, 5 - withCover.length)),
]
