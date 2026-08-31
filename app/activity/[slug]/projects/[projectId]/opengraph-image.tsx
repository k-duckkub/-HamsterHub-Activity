import { projectById } from '@/data/projects'
import { activityBySlug } from '@/data/activities'
import { brandCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'

export const alt = 'การ์ดแชร์ของผลงานบน HamsterHub'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: { slug: string; projectId: string }
}) {
  const project = projectById(params.projectId)
  const activity = activityBySlug(params.slug)
  return brandCard({
    eyebrow: activity?.space.title ?? 'ผลงาน',
    title: project?.title ?? 'ผลงานบน HamsterHub',
    meta: project ? `โดย ${project.creator}` : undefined,
  })
}
