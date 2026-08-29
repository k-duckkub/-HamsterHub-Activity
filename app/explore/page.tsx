import ExplorePage from '@/components/explore/ExplorePage'

export const metadata = {
  title: 'สำรวจพื้นที่ — HamsterHub',
}

/** Server Component — ส่งข้อมูลลงไปให้ client component ที่คุม interaction */
export default function Page() {
  return <ExplorePage />
}
