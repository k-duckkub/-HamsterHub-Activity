import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { activities, activityBySlug } from '@/data/activities'
import ActivityDetail from '@/components/activity/ActivityDetail'
import TopBar from '@/components/activity/TopBar'

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const activity = activityBySlug(params.slug)
  if (!activity) return { title: 'HamsterHub' }

  const title = `${activity.space.title} — HamsterHub`
  const description = activity.summary
  const path = `/activity/${activity.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  if (!activity) notFound()

  return (
    <main>
      <TopBar />
      <ActivityDetail activity={activity} />
    </main>
  )
}
