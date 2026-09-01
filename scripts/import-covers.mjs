/**
 * ผูกรูปปกจริงใน public/assets/activity-covers เข้ากับกิจกรรมตาม slug
 *
 *   npm run covers
 *
 * ชื่อไฟล์ที่ผู้ส่งตั้งมาไม่ตรงกับ slug ในข้อมูล จึงจับคู่ไว้ที่ COVER_MAP ตรงนี้ที่เดียว
 * ไฟล์ไหนยังจับคู่ไม่ได้ สคริปต์จะรายงานออกมา ไม่เดาให้เอง และกิจกรรมนั้นจะใช้ไอคอนเดิมต่อไป
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const DIR = join(ROOT, 'public/assets/activity-covers')
const OUT = join(ROOT, 'data/activity-covers.generated.ts')

/** slug ของกิจกรรม → ไฟล์ปก และคำบรรยายภาพ */
const COVER_MAP = {
  'scigame-lab-camp': ['sci-game-lab-camp.jpg', 'โปสเตอร์กิจกรรม SciGame Lab Camp'],
  'intelligence-camp-ep-2': ['intelligence-camp-ep2.jpg', 'โปสเตอร์กิจกรรม Intelligence Camp EP2'],
  'ai-camp-season-2-for-dek70': ['ai-camp-season-2.jpg', 'โปสเตอร์กิจกรรม AI Camp Season 2'],
  // โปสเตอร์ใบนี้โฆษณาสองกิจกรรมในภาพเดียว (AI Camp Season 2 และ AI for Business)
  // จึงเป็นโปสเตอร์ของทั้งคู่จริง ๆ ไม่ใช่การหยิบภาพกิจกรรมอื่นมาใช้แทน
  'ai-for-business': ['ai-camp-season-2.jpg', 'โปสเตอร์กิจกรรม AI for Business'],
  'nsc-software-project-2026': [
    'nsc-software-project-2026.jpg',
    'โปสเตอร์กิจกรรม NSC Software Project 2026',
  ],
  'game-jam-x-5th-year': ['gamejam-x-5th-year.jpg', 'โปสเตอร์กิจกรรม GameJam X ครบรอบ 5 ปี'],
  'python-x-hunter-camp': ['python-hunter-camp.jpg', 'โปสเตอร์กิจกรรม Python Hunter Camp'],
  'game-pee-camp': ['unity-ghost-camp.jpg', 'โปสเตอร์กิจกรรม Game Pee Camp เกมผีด้วย Unity'],
  'kid-day': ['hamster-kids-day.jpg', 'โปสเตอร์กิจกรรม Hamster Kids Day'],
}

const generated = readFileSync(join(ROOT, 'data/activities.generated.ts'), 'utf8')
const slugs = new Set([...generated.matchAll(/"slug": "([^"]+)"/g)].map((match) => match[1]))
const files = existsSync(DIR) ? readdirSync(DIR).filter((name) => /\.(jpe?g|png|webp)$/i.test(name)) : []

const covers = []
const problems = []

for (const [slug, [file, alt]] of Object.entries(COVER_MAP)) {
  if (!slugs.has(slug)) {
    problems.push(`ไม่มีกิจกรรม slug "${slug}" — ข้าม ${file}`)
    continue
  }
  if (!files.includes(file)) {
    problems.push(`ไม่พบไฟล์ ${file} สำหรับ ${slug}`)
    continue
  }
  const { width, height } = await sharp(join(DIR, file)).metadata()
  if (!width || !height) {
    problems.push(`อ่านขนาดภาพ ${file} ไม่ได้`)
    continue
  }
  covers.push({ slug, src: `/assets/activity-covers/${file}`, width, height, alt, position: 'center' })
}

const mapped = new Set(covers.map((cover) => cover.src.split('/').pop()))
for (const file of files) {
  if (!mapped.has(file)) problems.push(`ยังไม่ได้จับคู่: ${file}`)
}

const body = covers
  .sort((a, b) => a.slug.localeCompare(b.slug))
  .map(
    (cover) =>
      `  '${cover.slug}': {\n` +
      `    src: '${cover.src}',\n` +
      `    width: ${cover.width},\n` +
      `    height: ${cover.height},\n` +
      `    alt: '${cover.alt}',\n` +
      `    position: '${cover.position}',\n` +
      `  },`
  )
  .join('\n')

writeFileSync(
  OUT,
  `// สร้างจาก scripts/import-covers.mjs — อย่าแก้ไฟล์นี้ด้วยมือ\n` +
    `import type { ActivityCover } from './activity-types'\n\n` +
    `export const activityCovers: Record<string, ActivityCover> = {\n${body}${body ? '\n' : ''}}\n`
)

console.log(`เขียน ${OUT} — ผูกรูปปกได้ ${covers.length} จาก ${slugs.size} กิจกรรม`)
for (const problem of problems) console.warn(`  ! ${problem}`)
