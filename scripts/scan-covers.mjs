/**
 * รวบรวมรูปปกจริงของแต่ละกิจกรรมจาก public/assets/activities
 * ชื่อไฟล์ต้องเป็น <slug>.<png|jpg|jpeg|webp> ตาม slug ใน data/activities.generated.ts
 *
 *   node scripts/scan-covers.mjs
 *
 * ไฟล์ไหนไม่มี กิจกรรมนั้นก็ใช้ไอคอนจาก sprite sheet ต่อไป ไม่มีการใส่รูปแทน
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const DIR = join(ROOT, 'public/assets/activities')
const OUT = join(ROOT, 'data/activity-covers.generated.ts')
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']

const generated = readFileSync(join(ROOT, 'data/activities.generated.ts'), 'utf8')
const slugs = new Set([...generated.matchAll(/"slug": "([^"]+)"/g)].map((match) => match[1]))

const files = existsSync(DIR)
  ? readdirSync(DIR).filter((name) => EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)))
  : []

const covers = []
for (const name of files.sort()) {
  const slug = name.replace(/\.[^.]+$/, '')
  if (!slugs.has(slug)) {
    console.warn(`ข้าม ${name} — ไม่มีกิจกรรม slug "${slug}"`)
    continue
  }
  const { width, height } = await sharp(join(DIR, name)).metadata()
  if (!width || !height) {
    console.warn(`ข้าม ${name} — อ่านขนาดภาพไม่ได้`)
    continue
  }
  covers.push({ slug, src: `/assets/activities/${name}`, width, height })
}

const body = covers
  .map(
    (cover) =>
      `  '${cover.slug}': { src: '${cover.src}', width: ${cover.width}, height: ${cover.height} },`
  )
  .join('\n')

writeFileSync(
  OUT,
  `// สร้างจาก scripts/scan-covers.mjs — อย่าแก้ไฟล์นี้ด้วยมือ\n` +
    `import type { ActivityCover } from './activity-types'\n\n` +
    `export const activityCovers: Record<string, ActivityCover> = {\n${body}${body ? '\n' : ''}}\n`
)

console.log(`เขียน ${OUT} — พบรูปปก ${covers.length} จาก ${slugs.size} กิจกรรม`)
for (const slug of slugs) {
  if (!covers.some((cover) => cover.slug === slug)) console.log(`  ยังไม่มีรูป: ${slug}`)
}
