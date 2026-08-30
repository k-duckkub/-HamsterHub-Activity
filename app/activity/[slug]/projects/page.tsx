import { notFound } from 'next/navigation'
import { activities, activityBySlug } from '@/data/activities'
import ActivityDetail from '@/components/activity/ActivityDetail'
import TopBar from '@/components/activity/TopBar'
import ActivityProjects from '@/components/activity/ActivityProjects'
import SwipePageShell from '@/components/navigation/SwipePageShell'

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  return {
    title: activity ? `ผลงานจาก ${activity.space.title} — HamsterHub` : 'HamsterHub',
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  if (!activity) notFound()

  return (
    <SwipePageShell
      direction="left"
      destination={`/activity/${activity.slug}`}
      actionLabel="รายละเอียดกิจกรรม"
      preferBack
      preview={
        <>
          <TopBar />
          <ActivityDetail activity={activity} />
        </>
      }
    >
      <ActivityProjects activity={activity} />
    </SwipePageShell>
  )
}
