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
  /** ยอดถูกใจแบบย่อ เช่น 1 พัน */
  likes: string
  followers: string
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

const DATES: Record<string, string> = {
  'gamejam-x': '24–27 เมษายน 2569',
  'gamedev-tournament': '10–12 มกราคม 2569',
  'gamejam-international': '18–21 มิถุนายน 2569',
  'nuutor-cup': '5–6 กันยายน 2569',
  'roblox-jam': '2–4 สิงหาคม 2569',
}

const LIKES: Record<string, string> = {
  'gamejam-x': '1 พัน',
  'gamedev-tournament': '2.4 พัน',
  'gamejam-international': '1.8 พัน',
  'nuutor-cup': '3.1 พัน',
  'roblox-jam': '4.2 พัน',
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
    status: STATUS[space.id] ?? 'closed',
    dateRange: DATES[space.id] ?? '12–18 กันยายน 2569',
    teamSize: 'ทีม 2–5 คน',
    fee: 'ค่าสมัคร 190 บาท',
    prize: 'รางวัลกว่า 10,000 บาท',
    likes: LIKES[space.id] ?? '980',
    followers: '1.93 แสน',
    summary: space.description,
    details: [
      `${space.title} เปิดให้ครีเอเตอร์ทุกระดับเข้าร่วม ไม่ว่าจะเพิ่งเริ่มต้นหรือทำเกมมาแล้วหลายตัว ไม่จำกัดว่าต้องเรียนสายไหนหรืออายุเท่าไหร่ ขอแค่มีเรื่องที่อยากเล่าและอยากทำให้มันเล่นได้จริง ทีมงานจะประกาศโจทย์พร้อมกันในวันเปิดกิจกรรมผ่านไลฟ์ของ ${organizer} แล้วทุกทีมมีเวลาเท่ากันในการสร้างผลงานตั้งแต่วินาทีนั้น`,
      'โจทย์จะเป็นคำสั้น ๆ ที่ตีความได้หลายทาง ไม่ได้บังคับแนวเกม ไม่ได้บังคับเอนจิน จะทำเป็นเกมแพลตฟอร์ม เกมเล่าเรื่อง เกมปริศนา หรืออะไรที่ยังไม่มีชื่อเรียกก็ได้ทั้งนั้น สิ่งเดียวที่กรรมการดูคือผลงานตอบโจทย์ในแบบของทีมคุณได้ชัดแค่ไหน',
      'สมัครเป็นทีม 2–5 คนหรือมาคนเดียวก็ได้ ถ้ายังไม่มีทีม ในห้องแชทของกิจกรรมจะมีช่องหาเพื่อนร่วมทีมให้โพสต์แนะนำตัวว่าถนัดอะไร อยากได้ใครมาเติม แล้วจับคู่กันก่อนวันเริ่มจริง หลายทีมที่ได้รางวัลในรอบก่อน ๆ ก็เพิ่งเจอกันในห้องนี้',
      'ตลอดกิจกรรมจะมีพี่เลี้ยงจาก CampHub ประจำอยู่ในห้องแชทของพื้นที่ คอยตอบคำถามทั้งเรื่องการออกแบบเกม การเขียนโค้ด การทำอาร์ต และการจัดการเวลาในทีม ถามได้ทุกช่วง ไม่ต้องรอรอบให้คำปรึกษา และจะมีช่วงรีวิวงานกลางทางให้ทีมที่อยากได้ความเห็นก่อนส่งจริง',
      'เครื่องมือใช้ได้อิสระ ทั้ง Unity, Godot, Unreal, Construct หรือเขียนเองล้วน ๆ อาร์ตและเสียงจะทำเองหรือหยิบของฟรีที่มีสิทธิ์ใช้งานถูกต้องมาใช้ก็ได้ ขอแค่ระบุที่มาไว้ในหน้าผลงาน สิ่งที่ห้ามมีอย่างเดียวคือเอางานเก่าที่ทำไว้ก่อนวันเปิดโจทย์มาส่ง',
      'ส่งงานได้จนถึงเที่ยงคืนของวันสุดท้าย อัปโหลดไฟล์เกมพร้อมภาพปกและคำอธิบายสั้น ๆ ผ่านหน้าผลงานของกิจกรรมได้เลย แก้ไขและอัปโหลดทับได้ไม่จำกัดครั้งจนกว่าจะหมดเวลา ระบบจะเก็บเวอร์ชันล่าสุดที่ส่งไว้เป็นตัวตัดสิน',
      'ผลงานทุกชิ้นจะถูกนำขึ้นหน้าผลงานของกิจกรรมให้ทุกคนเข้าไปเล่นและโหวตได้ คะแนนรวมมาจากสองทาง คือคะแนนโหวตของผู้เล่นและคะแนนจากกรรมการที่ดูความคิดสร้างสรรค์ ความสมบูรณ์ของตัวเกม และการตีความโจทย์ ประกาศผลภายในสองสัปดาห์หลังปิดรับ',
      `ทีมที่ได้รางวัลจะได้รับเชิญไปเล่าเบื้องหลังในไลฟ์ของ HamsterHub เดือนถัดไป และผลงานจะถูกปักไว้บนหน้าแรกของพื้นที่ ${space.title} ต่ออีกหนึ่งเดือน ส่วนทุกทีมที่ส่งงานทันเวลาจะได้เกียรติบัตรและหน้าผลงานถาวรที่แชร์ต่อได้`,
      'ถ้ายังไม่แน่ใจว่าจะเริ่มยังไง เข้าไปดูผลงานจากรอบก่อนหน้าได้ในหน้าผลงานของกิจกรรม หลายชิ้นทำเสร็จภายในสองวันด้วยทีมสองคน ขนาดของเกมไม่เคยเป็นตัวตัดสิน สิ่งที่คนจำได้คือไอเดียที่ชัดและเล่นแล้วรู้สึกอะไรบางอย่าง',
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
