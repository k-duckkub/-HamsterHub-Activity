import { realActivities } from './activities.generated'
import { activityCovers } from './activity-covers.generated'
import type { ActivityCover, RealActivity } from './activity-types'
import { spaces, type Space } from './spaces'

export type { ActivityCover, RealActivity }

/**
 * กิจกรรมหนึ่งรายการบนเว็บ = ข้อมูลจริงจาก CSV + งานศิลป์หนึ่งชุด
 * กิจกรรมที่ยังไม่ได้รูปปกจริง ใช้ไอคอนกับคู่สีจาก sprite sheet ไปก่อน
 */
export type Activity = RealActivity & {
  space: Space
  /** ช่วงวันที่แบบอ่านรวดเดียว เช่น "23 ม.ค. – 25 ม.ค." */
  dateRange: string
}

const artFor = (index: number): Space => {
  const space = spaces[index % spaces.length]
  if (!space) throw new Error('spaces.ts ว่าง')
  return space
}

export const activities: Activity[] = realActivities.map((activity, index) => {
  const art = artFor(index)
  const cover = activityCovers[activity.slug]
  return {
    ...activity,
    dateRange:
      activity.dateEnd && activity.dateEnd !== activity.dateStart
        ? `${activity.dateStart} – ${activity.dateEnd}`
        : activity.dateStart,
    space: {
      ...art,
      // ชื่อ หมวด และคำโปรยมาจากข้อมูลจริง เหลือไว้แค่ไอคอนกับสีที่ยืมมา
      id: activity.slug,
      title: activity.title,
      category: activity.categories[0] ?? '',
      description: activity.summary,
      // ใส่รูปปกให้เฉพาะกิจกรรมที่มีไฟล์จริง ที่เหลือยังใช้ไอคอนจาก sprite sheet
      coverImage: cover?.src,
      coverAlt: cover?.alt,
      coverPosition: cover?.position,
    },
  }
})

export const activityBySlug = (slug: string): Activity | undefined =>
  activities.find((activity) => activity.slug === slug)

/** ใช้ตอนสร้างลิงก์จากผลงานกลับไปหากิจกรรมต้นทาง */
export const slugForSpace = (spaceId: string): string => spaceId
