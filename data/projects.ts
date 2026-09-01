export type Project = {
  id: string
  /** slug ของกิจกรรมที่ผลงานนี้ส่งเข้าร่วม */
  activitySlug: string
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
  /** ภาพปกจริงของผลงาน ถ้ามี — ดู docs/project-cover-import.md */
  coverImage?: string
  /** คำบรรยายภาพปก บังคับเมื่อมี coverImage */
  coverAlt?: string
}

export const projects: Project[] = [
  // RobloxJam
  { id: 'rj-1', activitySlug: 'game-jam-x-5th-year', title: 'นครลอยฟ้าแห่งเวทมนตร์', creator: 'NongGame', initial: 'N', viewers: '2.4K', views: 2400, daysAgo: 3, tint: ['#1B4B6B', '#0D1117'] },
  { id: 'rj-2', activitySlug: 'ai-camp-season-2-for-dek70', title: 'หนีออกจากโรงเรียนตอนเที่ยงคืน', creator: 'PloyDev', initial: 'P', viewers: '3.1K', views: 3100, daysAgo: 2, tint: ['#22304A', '#0D1117'] },
  { id: 'rj-3', activitySlug: 'ai-for-business', title: 'ร้านราเมงของผมวุ่นวายเกินไปแล้ว!', creator: 'Tonnam Studio', initial: 'T', viewers: '4.7K', views: 4700, daysAgo: 5, tint: ['#6B2B1E', '#0D1117'] },
  { id: 'rj-4', activitySlug: 'dek70-camp', title: 'สงครามหุ่นยนต์: Final Arena', creator: 'BeamBuilder', initial: 'B', viewers: '5.6K', views: 5600, daysAgo: 1, tint: ['#3A2140', '#0D1117'] },
  { id: 'rj-5', activitySlug: 'dek70-camp-first', title: 'เกาะเอาชีวิตรอด 100 วัน', creator: 'MewMew', initial: 'M', viewers: '3.8K', views: 3800, daysAgo: 4, tint: ['#14524F', '#0D1117'] },
  { id: 'rj-6', activitySlug: 'dek70-camp-first', title: 'เมืองนี้สร้างได้ด้วยกัน', creator: 'Team Sunday', initial: 'S', viewers: '6.2K', views: 6200, daysAgo: 2, tint: ['#2E4A22', '#0D1117'] },

  // Nuutor Cup
  { id: 'nc-1', activitySlug: 'dek70-camp', title: 'รอบชิงชนะเลิศ: เกมแพลตฟอร์มเมอร์ 60 วินาที', creator: 'PetchDev', initial: 'P', viewers: '5.1K', views: 5100, daysAgo: 1, tint: ['#5A3A12', '#0D1117'] },
  { id: 'nc-2', activitySlug: 'game-jam-x-5th-year', title: 'หุ่นกระดาษผจญภัย', creator: 'Nine Studio', initial: 'N', viewers: '2.2K', views: 2200, daysAgo: 3, tint: ['#4A2A3A', '#0D1117'] },
  { id: 'nc-3', activitySlug: 'game-pee-camp', title: 'ปริศนากลไกใต้หอนาฬิกา', creator: 'ArmCode', initial: 'A', viewers: '3.4K', views: 3400, daysAgo: 2, tint: ['#1E3A5C', '#0D1117'] },
  { id: 'nc-4', activitySlug: 'game-pee-camp', title: 'วิ่งให้ทันรถไฟขบวนสุดท้าย', creator: 'FahMakes', initial: 'F', viewers: '4.4K', views: 4400, daysAgo: 5, tint: ['#63301B', '#0D1117'] },
  { id: 'nc-5', activitySlug: 'intelligence-camp-ep-2', title: 'ครัวลับของเชฟตัวจิ๋ว', creator: 'BeamBuilder', initial: 'B', viewers: '1.9K', views: 1900, daysAgo: 6, tint: ['#3F4A16', '#0D1117'] },
  { id: 'nc-6', activitySlug: 'intelligence-camp', title: 'ดวลปลายนิ้ว: Rhythm Cup', creator: 'MewMew', initial: 'M', viewers: '2.8K', views: 2800, daysAgo: 4, tint: ['#2B2159', '#0D1117'] },

  // GameJam International
  { id: 'gi-1', activitySlug: 'kid-day', title: 'เพื่อนใหม่จากอีกซีกโลก', creator: 'Mind & Kai', initial: 'M', viewers: '3.9K', views: 3900, daysAgo: 2, tint: ['#14495A', '#0D1117'] },
  { id: 'gi-2', activitySlug: 'nsc-software-project-2026', title: 'ตลาดกลางคืนข้ามเวลา', creator: 'PloyDev', initial: 'P', viewers: '2.6K', views: 2600, daysAgo: 4, tint: ['#5C2E44', '#0D1117'] },
  { id: 'gi-3', activitySlug: 'python-adventure-camp', title: 'ส่งจดหมายรอบโลกใน 7 วัน', creator: 'Team Sunday', initial: 'S', viewers: '4.1K', views: 4100, daysAgo: 1, tint: ['#1F4636', '#0D1117'] },
  { id: 'gi-4', activitySlug: 'python-x-hunter-camp', title: 'ภาษาที่เราคิดขึ้นเอง', creator: 'NongGame', initial: 'N', viewers: '1.7K', views: 1700, daysAgo: 6, tint: ['#33305E', '#0D1117'] },
  { id: 'gi-5', activitySlug: 'scigame-lab-camp', title: 'สถานีอวกาศ 12 ประเทศ', creator: 'ArmCode', initial: 'A', viewers: '5.3K', views: 5300, daysAgo: 3, tint: ['#1B3358', '#0D1117'] },
  { id: 'gi-6', activitySlug: 'starlight', title: 'เกมกระดานของหมู่บ้านเล็ก ๆ', creator: 'FahMakes', initial: 'F', viewers: '2.1K', views: 2100, daysAgo: 5, tint: ['#5A431A', '#0D1117'] },

  // GameJam X
  { id: 'gx-1', activitySlug: 'tech-booster-for-teens', title: 'เกมที่เล่นได้ครั้งเดียว', creator: 'PetchDev', initial: 'P', viewers: '4.8K', views: 4800, daysAgo: 1, tint: ['#4A1E2E', '#0D1117'] },
  { id: 'gx-2', activitySlug: 'game-jam-x-5th-year', title: 'ไม่มีปุ่มกระโดดในเกมนี้', creator: 'BeamBuilder', initial: 'B', viewers: '3.2K', views: 3200, daysAgo: 3, tint: ['#22405A', '#0D1117'] },
  { id: 'gx-3', activitySlug: 'ai-camp-season-2-for-dek70', title: 'ศัตรูคือเงาของคุณเอง', creator: 'Nine Studio', initial: 'N', viewers: '5.9K', views: 5900, daysAgo: 2, tint: ['#2C2C3E', '#0D1117'] },
  { id: 'gx-4', activitySlug: 'ai-for-business', title: 'ยิ่งแพ้ยิ่งเก่งขึ้น', creator: 'MewMew', initial: 'M', viewers: '2.3K', views: 2300, daysAgo: 5, tint: ['#553119', '#0D1117'] },
  { id: 'gx-5', activitySlug: 'dek70-camp', title: 'แผนที่เปลี่ยนทุกครั้งที่หลับตา', creator: 'Tonnam Studio', initial: 'T', viewers: '3.6K', views: 3600, daysAgo: 4, tint: ['#173F45', '#0D1117'] },
  { id: 'gx-6', activitySlug: 'dek70-camp-first', title: 'เสียงคือทางเดียวที่มองเห็น', creator: 'PloyDev', initial: 'P', viewers: '1.5K', views: 1500, daysAgo: 7, tint: ['#3B2450', '#0D1117'] },

  // GameDev Tournament
  { id: 'dt-1', activitySlug: 'dek70-camp-first', title: 'บอสสุดท้ายที่ไม่มีใครผ่าน', creator: 'ArmCode', initial: 'A', viewers: '6.1K', views: 6100, daysAgo: 1, tint: ['#5B2020', '#0D1117'] },
  { id: 'dt-2', activitySlug: 'dek70-camp', title: 'สนามซ้อมของนักพัฒนา', creator: 'Team Sunday', initial: 'S', viewers: '2.9K', views: 2900, daysAgo: 3, tint: ['#1D3E52', '#0D1117'] },
  { id: 'dt-3', activitySlug: 'game-jam-x-5th-year', title: 'แข่งสร้างด่านใน 48 ชั่วโมง', creator: 'NongGame', initial: 'N', viewers: '4.3K', views: 4300, daysAgo: 2, tint: ['#4C3A15', '#0D1117'] },
  { id: 'dt-4', activitySlug: 'game-pee-camp', title: 'ทีมละสามคน เกมละหนึ่งกลไก', creator: 'FahMakes', initial: 'F', viewers: '3.5K', views: 3500, daysAgo: 4, tint: ['#26424F', '#0D1117'] },
  { id: 'dt-5', activitySlug: 'game-pee-camp', title: 'ปลดล็อกสกิลด้วยการอ่านโค้ด', creator: 'PetchDev', initial: 'P', viewers: '2.0K', views: 2000, daysAgo: 6, tint: ['#2F4A2A', '#0D1117'] },
  { id: 'dt-6', activitySlug: 'intelligence-camp-ep-2', title: 'ตำนานแชมป์ปีที่แล้ว', creator: 'Nine Studio', initial: 'N', viewers: '5.0K', views: 5000, daysAgo: 5, tint: ['#402A55', '#0D1117'] },

  // GameJam 1
  { id: 'gj1-1', activitySlug: 'intelligence-camp', title: 'เกมแรกของผมชื่อว่ากระต่ายหลงทาง', creator: 'NongGame', initial: 'N', viewers: '2.7K', views: 2700, daysAgo: 2, tint: ['#1F3A55', '#0D1117'] },
  { id: 'gj1-2', activitySlug: 'kid-day', title: 'กระโดดข้ามหลุมให้ครบสิบด่าน', creator: 'PloyDev', initial: 'P', viewers: '1.4K', views: 1400, daysAgo: 4, tint: ['#3E2A4C', '#0D1117'] },
  { id: 'gj1-3', activitySlug: 'nsc-software-project-2026', title: 'เก็บดาวก่อนพระอาทิตย์ตก', creator: 'FahMakes', initial: 'F', viewers: '2.1K', views: 2100, daysAgo: 1, tint: ['#5A4318', '#0D1117'] },
  { id: 'gj1-4', activitySlug: 'python-adventure-camp', title: 'เขาวงกตของเด็กฝึกหัด', creator: 'ArmCode', initial: 'A', viewers: '1.8K', views: 1800, daysAgo: 5, tint: ['#1B4A55', '#0D1117'] },
  { id: 'gj1-5', activitySlug: 'python-x-hunter-camp', title: 'วิ่งหนีลูกบอลยักษ์', creator: 'MewMew', initial: 'M', viewers: '3.3K', views: 3300, daysAgo: 3, tint: ['#5C2A22', '#0D1117'] },
  { id: 'gj1-6', activitySlug: 'scigame-lab-camp', title: 'เกมจับคู่ผลไม้ในสวนหลังบ้าน', creator: 'Team Sunday', initial: 'T', viewers: '1.1K', views: 1100, daysAgo: 6, tint: ['#28451F', '#0D1117'] },

  // GameJam 3
  { id: 'gj3-1', activitySlug: 'starlight', title: 'มีเวลาเดินได้แค่สิบก้าว', creator: 'PetchDev', initial: 'P', viewers: '3.4K', views: 3400, daysAgo: 1, tint: ['#1A3A44', '#0D1117'] },
  { id: 'gj3-2', activitySlug: 'tech-booster-for-teens', title: 'ห้องที่หมุนทุกครั้งที่คุณหยุด', creator: 'Nine Studio', initial: 'N', viewers: '2.5K', views: 2500, daysAgo: 3, tint: ['#33254E', '#0D1117'] },
  { id: 'gj3-3', activitySlug: 'game-jam-x-5th-year', title: 'สร้างสะพานด้วยของที่เหลืออยู่', creator: 'ArmCode', initial: 'A', viewers: '4.0K', views: 4000, daysAgo: 2, tint: ['#4A3A15', '#0D1117'] },
  { id: 'gj3-4', activitySlug: 'ai-camp-season-2-for-dek70', title: 'เกมที่ควบคุมได้ทีละปุ่ม', creator: 'BeamBuilder', initial: 'B', viewers: '1.9K', views: 1900, daysAgo: 5, tint: ['#1E4038', '#0D1117'] },
  { id: 'gj3-5', activitySlug: 'ai-for-business', title: 'แสงเทียนเหลือสามนาที', creator: 'FahMakes', initial: 'F', viewers: '2.8K', views: 2800, daysAgo: 4, tint: ['#5A3520', '#0D1117'] },
  { id: 'gj3-6', activitySlug: 'dek70-camp', title: 'ทุกครั้งที่ตายแผนที่จะเล็กลง', creator: 'Tonnam Studio', initial: 'T', viewers: '3.7K', views: 3700, daysAgo: 6, tint: ['#2B2F55', '#0D1117'] },

  // GameJam 4
  { id: 'gj4-1', activitySlug: 'dek70-camp-first', title: 'สองคนถือคนละครึ่งแผนที่', creator: 'Mind & Kai', initial: 'M', viewers: '4.2K', views: 4200, daysAgo: 1, tint: ['#173F52', '#0D1117'] },
  { id: 'gj4-2', activitySlug: 'dek70-camp-first', title: 'ครัวของทีมที่ไม่เคยตรงกัน', creator: 'MewMew', initial: 'M', viewers: '2.6K', views: 2600, daysAgo: 3, tint: ['#5B3018', '#0D1117'] },
  { id: 'gj4-3', activitySlug: 'dek70-camp', title: 'ช่างซ่อมยานสามตำแหน่ง', creator: 'Team Sunday', initial: 'T', viewers: '3.1K', views: 3100, daysAgo: 2, tint: ['#22364F', '#0D1117'] },
  { id: 'gj4-4', activitySlug: 'game-jam-x-5th-year', title: 'ส่งสัญญาณให้เพื่อนที่มองไม่เห็น', creator: 'PloyDev', initial: 'P', viewers: '1.7K', views: 1700, daysAgo: 6, tint: ['#3A2447', '#0D1117'] },
  { id: 'gj4-5', activitySlug: 'game-pee-camp', title: 'ป้อมปราการที่ต้องผลัดกันเฝ้า', creator: 'NongGame', initial: 'N', viewers: '2.9K', views: 2900, daysAgo: 4, tint: ['#2E4526', '#0D1117'] },
  { id: 'gj4-6', activitySlug: 'game-pee-camp', title: 'แข่งวาดภาพเดียวกันคนละมุม', creator: 'Nine Studio', initial: 'N', viewers: '2.2K', views: 2200, daysAgo: 5, tint: ['#4C2440', '#0D1117'] },

  // GameJam 5
  { id: 'gj5-1', activitySlug: 'intelligence-camp-ep-2', title: 'ร้านดอกไม้ที่ขายความทรงจำ', creator: 'FahMakes', initial: 'F', viewers: '3.8K', views: 3800, daysAgo: 2, tint: ['#4A2544', '#0D1117'] },
  { id: 'gj5-2', activitySlug: 'intelligence-camp', title: 'เมืองที่วาดขึ้นใหม่ทุกเช้า', creator: 'ArmCode', initial: 'A', viewers: '2.4K', views: 2400, daysAgo: 4, tint: ['#1D3E58', '#0D1117'] },
  { id: 'gj5-3', activitySlug: 'kid-day', title: 'จดหมายจากตัวเองในอีกสิบปี', creator: 'PetchDev', initial: 'P', viewers: '4.5K', views: 4500, daysAgo: 1, tint: ['#54401A', '#0D1117'] },
  { id: 'gj5-4', activitySlug: 'nsc-software-project-2026', title: 'เกมที่เล่นด้วยเสียงร้องเพลง', creator: 'MewMew', initial: 'M', viewers: '2.0K', views: 2000, daysAgo: 5, tint: ['#2C2B58', '#0D1117'] },
  { id: 'gj5-5', activitySlug: 'python-adventure-camp', title: 'สวนสัตว์ของสัตว์ที่ไม่มีจริง', creator: 'Tonnam Studio', initial: 'T', viewers: '3.0K', views: 3000, daysAgo: 3, tint: ['#22492F', '#0D1117'] },
  { id: 'gj5-6', activitySlug: 'python-x-hunter-camp', title: 'ภาพวาดที่เดินออกจากกรอบ', creator: 'BeamBuilder', initial: 'B', viewers: '1.6K', views: 1600, daysAgo: 7, tint: ['#4E2A22', '#0D1117'] },

  // GameJam 6
  { id: 'gj6-1', activitySlug: 'scigame-lab-camp', title: 'โจทย์สุ่มใหม่ทุกสามนาที', creator: 'Nine Studio', initial: 'N', viewers: '3.5K', views: 3500, daysAgo: 1, tint: ['#1B3B4E', '#0D1117'] },
  { id: 'gj6-2', activitySlug: 'starlight', title: 'เกมที่กติกาเปลี่ยนกลางทาง', creator: 'NongGame', initial: 'N', viewers: '2.3K', views: 2300, daysAgo: 3, tint: ['#452B4E', '#0D1117'] },
  { id: 'gj6-3', activitySlug: 'tech-booster-for-teens', title: 'เดินได้เฉพาะตอนฝนตก', creator: 'PloyDev', initial: 'P', viewers: '4.1K', views: 4100, daysAgo: 2, tint: ['#20464A', '#0D1117'] },
  { id: 'gj6-4', activitySlug: 'game-jam-x-5th-year', title: 'ศัตรูจำทุกอย่างที่คุณทำ', creator: 'ArmCode', initial: 'A', viewers: '2.7K', views: 2700, daysAgo: 5, tint: ['#57291F', '#0D1117'] },
  { id: 'gj6-5', activitySlug: 'ai-camp-season-2-for-dek70', title: 'ทุกก้าวมีราคาต้องจ่าย', creator: 'Team Sunday', initial: 'T', viewers: '1.8K', views: 1800, daysAgo: 6, tint: ['#3B4419', '#0D1117'] },
  { id: 'gj6-6', activitySlug: 'ai-for-business', title: 'ปิดตาแล้วฟังทางให้ดี', creator: 'PetchDev', initial: 'P', viewers: '3.2K', views: 3200, daysAgo: 4, tint: ['#2A2452', '#0D1117'] },

  // GameJam SP 1
  { id: 'sp1-1', activitySlug: 'dek70-camp', title: 'แรงโน้มถ่วงกลับด้านได้ครั้งเดียว', creator: 'BeamBuilder', initial: 'B', viewers: '2.9K', views: 2900, daysAgo: 2, tint: ['#243A57', '#0D1117'] },
  { id: 'sp1-2', activitySlug: 'dek70-camp-first', title: 'เกมที่เดินถอยหลังตลอดเวลา', creator: 'MewMew', initial: 'M', viewers: '1.5K', views: 1500, daysAgo: 5, tint: ['#4A2C3E', '#0D1117'] },
  { id: 'sp1-3', activitySlug: 'dek70-camp-first', title: 'เงาเป็นพื้นที่ยืนได้', creator: 'Tonnam Studio', initial: 'T', viewers: '3.6K', views: 3600, daysAgo: 1, tint: ['#1E3F3A', '#0D1117'] },
  { id: 'sp1-4', activitySlug: 'dek70-camp', title: 'เวลาเดินเมื่อคุณขยับเท่านั้น', creator: 'FahMakes', initial: 'F', viewers: '4.3K', views: 4300, daysAgo: 3, tint: ['#553B16', '#0D1117'] },
  { id: 'sp1-5', activitySlug: 'game-jam-x-5th-year', title: 'ตัวละครสองตัวใช้ชีวิตร่วมกัน', creator: 'Mind & Kai', initial: 'M', viewers: '2.1K', views: 2100, daysAgo: 6, tint: ['#332C55', '#0D1117'] },
  { id: 'sp1-6', activitySlug: 'game-pee-camp', title: 'กระโดดได้เท่าจำนวนที่เก็บมา', creator: 'NongGame', initial: 'N', viewers: '1.9K', views: 1900, daysAgo: 4, tint: ['#2B4726', '#0D1117'] },

  // GameJam SP 2
  { id: 'sp2-1', activitySlug: 'game-pee-camp', title: 'ด่านเดียวที่ยาวหนึ่งชั่วโมง', creator: 'ArmCode', initial: 'A', viewers: '3.9K', views: 3900, daysAgo: 1, tint: ['#1C3652', '#0D1117'] },
  { id: 'sp2-2', activitySlug: 'intelligence-camp-ep-2', title: 'ทุกอย่างพังได้ รวมถึงพื้น', creator: 'PetchDev', initial: 'P', viewers: '2.5K', views: 2500, daysAgo: 4, tint: ['#5A2B1D', '#0D1117'] },
  { id: 'sp2-3', activitySlug: 'intelligence-camp', title: 'เกมที่ไม่มีปุ่มโจมตี', creator: 'Nine Studio', initial: 'N', viewers: '3.3K', views: 3300, daysAgo: 2, tint: ['#26454B', '#0D1117'] },
  { id: 'sp2-4', activitySlug: 'kid-day', title: 'เก็บชิ้นส่วนของตัวเองกลับคืน', creator: 'PloyDev', initial: 'P', viewers: '1.7K', views: 1700, daysAgo: 6, tint: ['#42264C', '#0D1117'] },
  { id: 'sp2-5', activitySlug: 'nsc-software-project-2026', title: 'เสียงหัวใจคือมาตรวัดพลัง', creator: 'Team Sunday', initial: 'T', viewers: '2.8K', views: 2800, daysAgo: 3, tint: ['#4F3A17', '#0D1117'] },
  { id: 'sp2-6', activitySlug: 'python-adventure-camp', title: 'ประตูสุดท้ายเปิดด้วยความเงียบ', creator: 'MewMew', initial: 'M', viewers: '2.2K', views: 2200, daysAgo: 5, tint: ['#2A2F4E', '#0D1117'] },
]

export const projectById = (id: string): Project | undefined =>
  projects.find((project) => project.id === id)

/** ผลงานอื่นในกิจกรรมเดียวกัน ใช้ที่ท้ายหน้ารายละเอียดผลงาน */
export const siblingProjects = (project: Project, limit = 3): Project[] =>
  projects
    .filter((item) => item.activitySlug === project.activitySlug && item.id !== project.id)
    .slice(0, limit)

export type SortKey = 'latest' | 'popular'

export function projectsFor(activitySlug: string, sort: SortKey): Project[] {
  const list = projects.filter((project) => project.activitySlug === activitySlug)
  return sort === 'latest'
    ? [...list].sort((a, b) => a.daysAgo - b.daysAgo)
    : [...list].sort((a, b) => b.views - a.views)
}
