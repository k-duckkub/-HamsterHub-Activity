import type { Metadata } from 'next'
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
}): Metadata {
  const project = projectById(params.projectId)
  const activity = activityBySlug(params.slug)
  if (!project || !activity) return { title: 'HamsterHub' }

  const title = `${project.title} — HamsterHub`
  const description = `ผลงานจาก ${activity.space.title} โดย ${project.creator}`
  const path = `/activity/${activity.slug}/projects/${project.id}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
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
