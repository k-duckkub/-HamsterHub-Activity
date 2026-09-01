export type Space = {
  id: string
  title: string
  category: string
  description: string
  viewers: string
  /** background-position ของ sprite sheet 4 คอลัมน์ x 3 แถว */
  iconPosition: string
  background: string
  accent: string
  /** รูปปกจริงของกิจกรรม ถ้ามีไฟล์อยู่จริงใน public/assets/activity-covers */
  coverImage?: string
  coverAlt?: string
  /** object-position ตอนครอปแสดงผล */
  coverPosition?: string
}

export const SPACE_ICON_SHEET = '/assets/hamsterhub-space-icons.png'

export const spaces: Space[] = [
  { id: 'gamedev-tournament', title: 'GameDev Tournament', category: 'TOURNAMENT', description: 'พิสูจน์ฝีมือพัฒนาเกมในการแข่งขันจริง', viewers: '1.8K', iconPosition: '0% 0%', background: '#10283A', accent: '#FF6B00' },
  { id: 'gamejam-1', title: 'GameJam 1', category: 'GAME JAM', description: 'เริ่มต้นสร้างเกมแรกภายใต้เวลาที่กำหนด', viewers: '1.2K', iconPosition: '33.333% 0%', background: '#17283C', accent: '#FF6B00' },
  { id: 'gamejam-3', title: 'GameJam 3', category: 'GAME JAM', description: 'ทดลองไอเดียใหม่และแก้โจทย์ด้วยข้อจำกัด', viewers: '980', iconPosition: '66.667% 0%', background: '#173840', accent: '#2C9FA2' },
  { id: 'gamejam-4', title: 'GameJam 4', category: 'TEAM JAM', description: 'รวมทีม แบ่งบทบาท และสร้างเกมไปด้วยกัน', viewers: '1.4K', iconPosition: '100% 0%', background: '#132C3E', accent: '#FF6B00' },
  { id: 'gamejam-5', title: 'GameJam 5', category: 'CREATIVE JAM', description: 'เปลี่ยนไอเดียธรรมดาให้เป็นเกมที่โดดเด่น', viewers: '1.1K', iconPosition: '0% 50%', background: '#29263A', accent: '#FF6B00' },
  { id: 'gamejam-6', title: 'GameJam 6', category: 'CHALLENGE JAM', description: 'สร้างเกมจากโจทย์สุ่มและเงื่อนไขที่คาดไม่ถึง', viewers: '860', iconPosition: '33.333% 50%', background: '#143249', accent: '#2C9FA2' },
  { id: 'gamejam-international', title: 'GameJam International', category: 'INTERNATIONAL', description: 'สร้างเกมและแลกเปลี่ยนไอเดียกับผู้เล่นทั่วโลก', viewers: '2.7K', iconPosition: '66.667% 50%', background: '#113A42', accent: '#2C9FA2' },
  { id: 'gamejam-sp-1', title: 'GameJam SP 1', category: 'SPECIAL JAM', description: 'ทดลองกลไกพิเศษในโจทย์ Game Jam รูปแบบใหม่', viewers: '740', iconPosition: '100% 50%', background: '#202C41', accent: '#FF6B00' },
  { id: 'gamejam-sp-2', title: 'GameJam SP 2', category: 'SPECIAL JAM', description: 'พัฒนาเกมต่อจากข้อจำกัดพิเศษที่ท้าทายกว่าเดิม', viewers: '790', iconPosition: '0% 100%', background: '#173246', accent: '#2C9FA2' },
  { id: 'gamejam-x', title: 'GameJam X', category: 'EXPERIMENTAL', description: 'เกมแจมรูปแบบพิเศษที่ไม่มีกฎตายตัว', viewers: '1.6K', iconPosition: '33.333% 100%', background: '#0A1A2F', accent: '#FF6B00' },
  { id: 'nuutor-cup', title: 'Nuutor Cup', category: 'COMPETITION', description: 'แข่งขันพัฒนาทักษะและชิงตำแหน่งแชมป์', viewers: '3.1K', iconPosition: '66.667% 100%', background: '#33261C', accent: '#FF6B00' },
  { id: 'roblox-jam', title: 'RobloxJam', category: 'ROBLOX', description: 'สร้างสรรค์โลกและเกมของตัวเองบน Roblox', viewers: '3.6K', iconPosition: '100% 100%', background: '#16384B', accent: '#FF6B00' },
]
