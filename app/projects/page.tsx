import { Suspense } from 'react'
import TopBar from '@/components/activity/TopBar'
import AllProjects from '@/components/projects/AllProjects'

export const metadata = {
  title: 'ผลงานทั้งหมด — HamsterHub',
  description: 'รวมผลงานจากทุกกิจกรรมบน HamsterHub',
}

export default function Page() {
  return (
    <>
      <TopBar />
      <Suspense fallback={null}>
        <AllProjects />
      </Suspense>
    </>
  )
}
