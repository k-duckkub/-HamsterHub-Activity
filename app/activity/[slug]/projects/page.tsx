import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { activities, activityBySlug } from '@/data/activities'
import TopBar from '@/components/activity/TopBar'
import ActivityProjects from '@/components/activity/ActivityProjects'
import SwipePageShell from '@/components/navigation/SwipePageShell'

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const activity = activityBySlug(params.slug)
  if (!activity) return { title: 'HamsterHub' }

  const title = `ผลงานจาก ${activity.space.title} — HamsterHub`
  const description = `ผลงานทั้งหมดที่ส่งเข้าร่วม ${activity.space.title}`
  const path = `/activity/${activity.slug}/projects`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  if (!activity) notFound()

  return (
    <SwipePageShell
      direction="left"
      destination={`/activity/${activity.slug}`}
      actionLabel="กลับไป"
    >
      <TopBar />
      <Suspense fallback={null}>
        <ActivityProjects activity={activity} />
      </Suspense>
    </SwipePageShell>
  )
}
