import { activities, type Activity } from './activities'

/**
 * 5 กิจกรรมที่ขึ้นหน้า Explore ตามแบบที่ออกไว้ — ปกเต็มจอหนึ่งใบ การ์ดเลือกห้าใบ
 * เรียงกิจกรรมที่มีโปสเตอร์จริงไว้ก่อน ถ้ายังไม่ครบห้าค่อยเติมด้วยกิจกรรมที่เหลือ
 */
const FEATURED_COUNT = 5

// โปสเตอร์ AI ใบเดียวเป็นของสองกิจกรรม แถวเลือกจึงต้องไม่โชว์ภาพซ้ำสองใบติดกัน
const seen = new Set<string>()
const withCover = activities.filter((activity) => {
  const cover = activity.space.coverImage
  if (!cover || seen.has(cover)) return false
  seen.add(cover)
  return true
})
const withoutCover = activities.filter((activity) => !activity.space.coverImage)

export const featuredActivities: Activity[] = [...withCover, ...withoutCover].slice(
  0,
  FEATURED_COUNT
)
