import { activityBySlug } from '@/data/activities'
import { brandCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'

export const alt = 'การ์ดแชร์ของกิจกรรมบน HamsterHub'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  return brandCard({
    eyebrow: activity?.space.category ?? 'ACTIVITY',
    title: activity?.space.title ?? 'HamsterHub',
    meta: activity ? `${activity.dateRange} · ${activity.organizer}` : undefined,
  })
}
