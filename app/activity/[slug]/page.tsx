import { notFound } from 'next/navigation'
import { activities, activityBySlug } from '@/data/activities'
import ActivityDetail from '@/components/activity/ActivityDetail'
import ActivityProjects from '@/components/activity/ActivityProjects'
import SwipePageShell from '@/components/navigation/SwipePageShell'

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  return { title: activity ? `${activity.space.title} — HamsterHub` : 'HamsterHub' }
}

export default function Page({ params }: { params: { slug: string } }) {
  const activity = activityBySlug(params.slug)
  if (!activity) notFound()

  return (
    <SwipePageShell
      direction="right"
      destination={`/activity/${activity.slug}/projects`}
      preview={<ActivityProjects activity={activity} />}
      tutorial={{
        title: 'ปัดซ้ายเพื่อดูผลงาน',
        description: 'ดูเกมและผลงานทั้งหมดจากกิจกรรมนี้',
        storageKey: 'hamsterhub-project-swipe-tutorial-seen',
      }}
    >
      <ActivityDetail activity={activity} />
    </SwipePageShell>
  )
}
