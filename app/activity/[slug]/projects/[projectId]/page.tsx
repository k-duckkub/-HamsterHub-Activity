import { notFound } from 'next/navigation'
import { activityBySlug } from '@/data/activities'
import { projectById, projects } from '@/data/projects'
import ProjectDetail from '@/components/activity/ProjectDetail'

export function generateStaticParams() {
  return projects.map((project) => ({ projectId: project.id }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string; projectId: string }
}) {
  const project = projectById(params.projectId)
  return { title: project ? `${project.title} — HamsterHub` : 'HamsterHub' }
}

export default function Page({
  params,
}: {
  params: { slug: string; projectId: string }
}) {
  const activity = activityBySlug(params.slug)
  const project = projectById(params.projectId)
  if (!activity || !project || project.spaceId !== activity.space.id) notFound()

  return (
    <main className="min-h-[100dvh] bg-[#0D1117]">
      <ProjectDetail project={project} activity={activity} />
    </main>
  )
}
