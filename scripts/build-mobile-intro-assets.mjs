/**
 * ย่อภาพอินโทรสำหรับมือถือจากไฟล์จริงในโฟลเดอร์เดียวกัน
 * ไม่ครอป ไม่แก้สี ไม่วาดใหม่ — แค่ลดขนาดและบีบอัด โดยคง alpha ไว้
 *
 *   node scripts/build-mobile-intro-assets.mjs
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = 'public/assets/activity-intro'
const TARGET = path.join(SOURCE, 'mobile')

/** ด้านยาวสุดหลังย่อ — ตัวละครไม่เกิน 900px ส่วนเอฟเฟกต์กว้างกว่าได้ตามสัดส่วนเดิม */
const MAX_LONG_EDGE = {
  'cute-baby-dragon.png': 900,
  'giant-hamster-grab.png': 900,
  'cute-fire-overlay.png': 1400,
  'soft-smoke-reveal.png': 1100,
}

await mkdir(TARGET, { recursive: true })

for (const [file, longEdge] of Object.entries(MAX_LONG_EDGE)) {
  const from = path.join(SOURCE, file)
  const to = path.join(TARGET, file)

  const image = sharp(from)
  const meta = await image.metadata()
  if (!meta.hasAlpha) throw new Error(`${file} ไม่มี alpha — หยุดไว้ก่อน`)

  const resizeTo =
    (meta.width ?? 0) >= (meta.height ?? 0) ? { width: longEdge } : { height: longEdge }

  await image
    .resize({ ...resizeTo, withoutEnlargement: true, fit: 'inside' })
    .png({ compressionLevel: 9, palette: false, effort: 10 })
    .toFile(to)

  const out = await sharp(to).metadata()
  console.log(
    `${file}: ${meta.width}x${meta.height} → ${out.width}x${out.height}` +
      ` | alpha ${out.hasAlpha ? 'ครบ' : 'หาย'}`
  )
}
