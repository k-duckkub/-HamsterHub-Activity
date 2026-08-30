export type Project = {
  id: string
  /** id ของพื้นที่ใน data/spaces.ts */
  spaceId: string
  title: string
  creator: string
  /** ตัวอักษรบนอวาตาร์ผู้สร้าง */
  initial: string
  viewers: string
  /** จำนวนวันที่ผ่านมา ใช้ทั้งเรียง “ล่าสุด” และแสดงผล */
  daysAgo: number
  /** ยอดผู้รับชมแบบตัวเลข ใช้เรียง “ยอดนิยม” */
  views: number
  /** คู่สีของ thumbnail ระหว่างรอภาพผลงานจริง */
  tint: [string, string]
}

export const projects: Project[] = [
  // RobloxJam
  { id: 'rj-1', spaceId: 'roblox-jam', title: 'นครลอยฟ้าแห่งเวทมนตร์', creator: 'NongGame', initial: 'N', viewers: '2.4K', views: 2400, daysAgo: 3, tint: ['#1B4B6B', '#0D1117'] },
  { id: 'rj-2', spaceId: 'roblox-jam', title: 'หนีออกจากโรงเรียนตอนเที่ยงคืน', creator: 'PloyDev', initial: 'P', viewers: '3.1K', views: 3100, daysAgo: 2, tint: ['#22304A', '#0D1117'] },
  { id: 'rj-3', spaceId: 'roblox-jam', title: 'ร้านราเมงของผมวุ่นวายเกินไปแล้ว!', creator: 'Tonnam Studio', initial: 'T', viewers: '4.7K', views: 4700, daysAgo: 5, tint: ['#6B2B1E', '#0D1117'] },
  { id: 'rj-4', spaceId: 'roblox-jam', title: 'สงครามหุ่นยนต์: Final Arena', creator: 'BeamBuilder', initial: 'B', viewers: '5.6K', views: 5600, daysAgo: 1, tint: ['#3A2140', '#0D1117'] },
  { id: 'rj-5', spaceId: 'roblox-jam', title: 'เกาะเอาชีวิตรอด 100 วัน', creator: 'MewMew', initial: 'M', viewers: '3.8K', views: 3800, daysAgo: 4, tint: ['#14524F', '#0D1117'] },
  { id: 'rj-6', spaceId: 'roblox-jam', title: 'เมืองนี้สร้างได้ด้วยกัน', creator: 'Team Sunday', initial: 'S', viewers: '6.2K', views: 6200, daysAgo: 2, tint: ['#2E4A22', '#0D1117'] },

  // Nuutor Cup
  { id: 'nc-1', spaceId: 'nuutor-cup', title: 'รอบชิงชนะเลิศ: เกมแพลตฟอร์มเมอร์ 60 วินาที', creator: 'PetchDev', initial: 'P', viewers: '5.1K', views: 5100, daysAgo: 1, tint: ['#5A3A12', '#0D1117'] },
  { id: 'nc-2', spaceId: 'nuutor-cup', title: 'หุ่นกระดาษผจญภัย', creator: 'Nine Studio', initial: 'N', viewers: '2.2K', views: 2200, daysAgo: 3, tint: ['#4A2A3A', '#0D1117'] },
  { id: 'nc-3', spaceId: 'nuutor-cup', title: 'ปริศนากลไกใต้หอนาฬิกา', creator: 'ArmCode', initial: 'A', viewers: '3.4K', views: 3400, daysAgo: 2, tint: ['#1E3A5C', '#0D1117'] },
  { id: 'nc-4', spaceId: 'nuutor-cup', title: 'วิ่งให้ทันรถไฟขบวนสุดท้าย', creator: 'FahMakes', initial: 'F', viewers: '4.4K', views: 4400, daysAgo: 5, tint: ['#63301B', '#0D1117'] },
  { id: 'nc-5', spaceId: 'nuutor-cup', title: 'ครัวลับของเชฟตัวจิ๋ว', creator: 'BeamBuilder', initial: 'B', viewers: '1.9K', views: 1900, daysAgo: 6, tint: ['#3F4A16', '#0D1117'] },
  { id: 'nc-6', spaceId: 'nuutor-cup', title: 'ดวลปลายนิ้ว: Rhythm Cup', creator: 'MewMew', initial: 'M', viewers: '2.8K', views: 2800, daysAgo: 4, tint: ['#2B2159', '#0D1117'] },

  // GameJam International
  { id: 'gi-1', spaceId: 'gamejam-international', title: 'เพื่อนใหม่จากอีกซีกโลก', creator: 'Mind & Kai', initial: 'M', viewers: '3.9K', views: 3900, daysAgo: 2, tint: ['#14495A', '#0D1117'] },
  { id: 'gi-2', spaceId: 'gamejam-international', title: 'ตลาดกลางคืนข้ามเวลา', creator: 'PloyDev', initial: 'P', viewers: '2.6K', views: 2600, daysAgo: 4, tint: ['#5C2E44', '#0D1117'] },
  { id: 'gi-3', spaceId: 'gamejam-international', title: 'ส่งจดหมายรอบโลกใน 7 วัน', creator: 'Team Sunday', initial: 'S', viewers: '4.1K', views: 4100, daysAgo: 1, tint: ['#1F4636', '#0D1117'] },
  { id: 'gi-4', spaceId: 'gamejam-international', title: 'ภาษาที่เราคิดขึ้นเอง', creator: 'NongGame', initial: 'N', viewers: '1.7K', views: 1700, daysAgo: 6, tint: ['#33305E', '#0D1117'] },
  { id: 'gi-5', spaceId: 'gamejam-international', title: 'สถานีอวกาศ 12 ประเทศ', creator: 'ArmCode', initial: 'A', viewers: '5.3K', views: 5300, daysAgo: 3, tint: ['#1B3358', '#0D1117'] },
  { id: 'gi-6', spaceId: 'gamejam-international', title: 'เกมกระดานของหมู่บ้านเล็ก ๆ', creator: 'FahMakes', initial: 'F', viewers: '2.1K', views: 2100, daysAgo: 5, tint: ['#5A431A', '#0D1117'] },

  // GameJam X
  { id: 'gx-1', spaceId: 'gamejam-x', title: 'เกมที่เล่นได้ครั้งเดียว', creator: 'PetchDev', initial: 'P', viewers: '4.8K', views: 4800, daysAgo: 1, tint: ['#4A1E2E', '#0D1117'] },
  { id: 'gx-2', spaceId: 'gamejam-x', title: 'ไม่มีปุ่มกระโดดในเกมนี้', creator: 'BeamBuilder', initial: 'B', viewers: '3.2K', views: 3200, daysAgo: 3, tint: ['#22405A', '#0D1117'] },
  { id: 'gx-3', spaceId: 'gamejam-x', title: 'ศัตรูคือเงาของคุณเอง', creator: 'Nine Studio', initial: 'N', viewers: '5.9K', views: 5900, daysAgo: 2, tint: ['#2C2C3E', '#0D1117'] },
  { id: 'gx-4', spaceId: 'gamejam-x', title: 'ยิ่งแพ้ยิ่งเก่งขึ้น', creator: 'MewMew', initial: 'M', viewers: '2.3K', views: 2300, daysAgo: 5, tint: ['#553119', '#0D1117'] },
  { id: 'gx-5', spaceId: 'gamejam-x', title: 'แผนที่เปลี่ยนทุกครั้งที่หลับตา', creator: 'Tonnam Studio', initial: 'T', viewers: '3.6K', views: 3600, daysAgo: 4, tint: ['#173F45', '#0D1117'] },
  { id: 'gx-6', spaceId: 'gamejam-x', title: 'เสียงคือทางเดียวที่มองเห็น', creator: 'PloyDev', initial: 'P', viewers: '1.5K', views: 1500, daysAgo: 7, tint: ['#3B2450', '#0D1117'] },

  // GameDev Tournament
  { id: 'dt-1', spaceId: 'gamedev-tournament', title: 'บอสสุดท้ายที่ไม่มีใครผ่าน', creator: 'ArmCode', initial: 'A', viewers: '6.1K', views: 6100, daysAgo: 1, tint: ['#5B2020', '#0D1117'] },
  { id: 'dt-2', spaceId: 'gamedev-tournament', title: 'สนามซ้อมของนักพัฒนา', creator: 'Team Sunday', initial: 'S', viewers: '2.9K', views: 2900, daysAgo: 3, tint: ['#1D3E52', '#0D1117'] },
  { id: 'dt-3', spaceId: 'gamedev-tournament', title: 'แข่งสร้างด่านใน 48 ชั่วโมง', creator: 'NongGame', initial: 'N', viewers: '4.3K', views: 4300, daysAgo: 2, tint: ['#4C3A15', '#0D1117'] },
  { id: 'dt-4', spaceId: 'gamedev-tournament', title: 'ทีมละสามคน เกมละหนึ่งกลไก', creator: 'FahMakes', initial: 'F', viewers: '3.5K', views: 3500, daysAgo: 4, tint: ['#26424F', '#0D1117'] },
  { id: 'dt-5', spaceId: 'gamedev-tournament', title: 'ปลดล็อกสกิลด้วยการอ่านโค้ด', creator: 'PetchDev', initial: 'P', viewers: '2.0K', views: 2000, daysAgo: 6, tint: ['#2F4A2A', '#0D1117'] },
  { id: 'dt-6', spaceId: 'gamedev-tournament', title: 'ตำนานแชมป์ปีที่แล้ว', creator: 'Nine Studio', initial: 'N', viewers: '5.0K', views: 5000, daysAgo: 5, tint: ['#402A55', '#0D1117'] },
]

export const projectById = (id: string): Project | undefined =>
  projects.find((project) => project.id === id)

/** ผลงานอื่นในกิจกรรมเดียวกัน ใช้ที่ท้ายหน้ารายละเอียดผลงาน */
export const siblingProjects = (project: Project, limit = 3): Project[] =>
  projects
    .filter((item) => item.spaceId === project.spaceId && item.id !== project.id)
    .slice(0, limit)

export type SortKey = 'latest' | 'popular'

export function projectsFor(spaceId: string, sort: SortKey): Project[] {
  const list = projects.filter((project) => project.spaceId === spaceId)
  return sort === 'latest'
    ? [...list].sort((a, b) => a.daysAgo - b.daysAgo)
    : [...list].sort((a, b) => b.views - a.views)
}
