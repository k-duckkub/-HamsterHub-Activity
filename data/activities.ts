import { spaces, type Space } from './spaces'

export type ActivityStatus = 'open' | 'judging' | 'closed'

export type Activity = {
  /** slug ใน URL เช่น /activity/game-jam-x */
  slug: string
  space: Space
  organizer: string
  organizerInitial: string
  status: ActivityStatus
  dateRange: string
  teamSize: string
  fee: string
  prize: string
  summary: string
  details: string[]
}

/** ชื่อ id ใน spaces.ts → slug ที่อ่านง่ายบน URL */
const SLUGS: Record<string, string> = {
  'gamedev-tournament': 'gamedev-tournament',
  'gamejam-1': 'game-jam-1',
  'gamejam-3': 'game-jam-3',
  'gamejam-4': 'game-jam-4',
  'gamejam-5': 'game-jam-5',
  'gamejam-6': 'game-jam-6',
  'gamejam-international': 'game-jam-international',
  'gamejam-sp-1': 'game-jam-sp-1',
  'gamejam-sp-2': 'game-jam-sp-2',
  'gamejam-x': 'game-jam-x',
  'nuutor-cup': 'nuutor-cup',
  'roblox-jam': 'roblox-jam',
}

const STATUS: Record<string, ActivityStatus> = {
  'gamejam-x': 'open',
  'roblox-jam': 'open',
  'nuutor-cup': 'judging',
  'gamejam-international': 'open',
  'gamedev-tournament': 'judging',
}

const ORGANIZERS: Record<string, string> = {
  'gamedev-tournament': 'HamsterHub Academy',
  'gamejam-international': 'HamsterHub Global',
  'gamejam-x': 'HamsterHub Lab',
  'nuutor-cup': 'Nuutor x HamsterHub',
  'roblox-jam': 'HamsterHub Roblox Club',
}

export const activities: Activity[] = spaces.map((space) => {
  const organizer = ORGANIZERS[space.id] ?? 'HamsterHub Studio'
  return {
    slug: SLUGS[space.id] ?? space.id,
    space,
    organizer,
    organizerInitial: organizer.charAt(0),
    status: STATUS[space.id] ?? 'open',
    dateRange: '12 – 18 กันยายน 2569',
    teamSize: 'ทีมละ 1–4 คน',
    fee: 'ไม่มีค่าสมัคร',
    prize: 'รวมกว่า 30,000 บาท',
    summary: space.description,
    details: [
      `${space.title} เปิดให้ครีเอเตอร์ทุกระดับเข้าร่วม ไม่ว่าจะเพิ่งเริ่มต้นหรือทำเกมมาแล้วหลายตัว ทีมงานจะประกาศโจทย์พร้อมกันในวันเปิดกิจกรรม แล้วทุกทีมมีเวลาเท่ากันในการสร้างผลงาน`,
      'ตลอดกิจกรรมจะมีพี่เลี้ยงจาก CampHub คอยตอบคำถามในห้องแชทของพื้นที่ ทั้งเรื่องการออกแบบเกม การเขียนโค้ด และการทำอาร์ต ส่งงานได้จนถึงเที่ยงคืนของวันสุดท้าย',
      'ผลงานทุกชิ้นจะถูกนำขึ้นหน้าผลงานของกิจกรรมให้ทุกคนเข้าไปเล่นและโหวตได้ ทีมที่ได้รางวัลจะได้รับเชิญไปเล่าเบื้องหลังในไลฟ์ของ HamsterHub เดือนถัดไป',
    ],
  }
})

export const activityBySlug = (slug: string): Activity | undefined =>
  activities.find((activity) => activity.slug === slug)

export const slugForSpace = (spaceId: string): string => SLUGS[spaceId] ?? spaceId

export const STATUS_LABEL: Record<ActivityStatus, string> = {
  open: 'เปิดรับสมัคร',
  judging: 'กำลังตัดสิน',
  closed: 'ปิดรับแล้ว',
}
