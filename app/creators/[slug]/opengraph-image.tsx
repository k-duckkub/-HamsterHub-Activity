import { creatorBySlug, projectsByCreator } from '@/data/creators'
import { brandCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'

export const alt = 'การ์ดแชร์ของผู้สร้างบน HamsterHub'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: { slug: string } }) {
  const creator = creatorBySlug(params.slug)
  const works = creator ? projectsByCreator(creator.name) : []
  return brandCard({
    eyebrow: 'ผู้สร้าง',
    title: creator?.name ?? 'HamsterHub',
    meta: creator ? `${works.length} ผลงาน` : undefined,
  })
}
