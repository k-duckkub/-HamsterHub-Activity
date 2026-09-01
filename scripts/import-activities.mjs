/**
 * แปลง CSV กิจกรรมจริงจาก CampHub เป็น data/activities.generated.ts
 *
 *   1. วางไฟล์ CSV ไว้ที่ data/source/activities/
 *   2. node scripts/import-activities.mjs
 *
 * สคริปต์นี้ไม่แต่งข้อมูลเพิ่ม ช่องไหนว่างใน CSV ก็ว่างในเว็บ
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE = 'data/source/activities'
const TARGET = 'data/activities.generated.ts'

/** หัวข้อใน CSV → ชื่อฟิลด์ในโค้ด */
const FIELDS = {
  'ชื่อกิจกรรม': 'title',
  'คำโปรย 190 Text': 'summary',
  'ประเภทกิจกรรม': 'categories',
  'วันที่เริ่มต้น': 'dateStart',
  'วันที่สิ้นสุด': 'dateEnd',
  'ข้อมูลเพิ่มเติมสำหรับวันที่สอน': 'scheduleNote',
  'วันที่รับสมัครวันสุดท้าย': 'applyDeadline',
  'จำนวนที่รับ': 'capacity',
  'ค่าใช้จ่าย': 'fee',
  'คุณสมบัติผู้สมัคร': 'eligibility',
  'คุณสมบัติเพิ่มเติม': 'extraRequirement',
  'ลิงค์ใบสมัคร': 'applyUrl',
  'คำอธิบายกิจกรรม': 'description',
}

/** อ่าน CSV ทีละอักขระ เพราะช่องคำอธิบายมีทั้งขึ้นบรรทัดใหม่และเครื่องหมายคำพูดซ้อน */
function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 1
        } else quoted = false
      } else cell += char
      continue
    }
    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') cell += char
  }
  row.push(cell)
  if (row.some((value) => value.trim() !== '')) rows.push(row)
  return rows
}

/** ชื่อกิจกรรมที่ยาวหรือเป็นภาษาไทย กำหนด slug เองให้ URL อ่านออก */
const SLUG_OVERRIDES = {
  'ค่าย เทคนิคปั้น Portfolio + ฝึกพื้นฐาน + แข่งสร้างเกม': 'portfolio-5-years',
  'Dek70 Plus+': 'dek70-plus-final-round',
  'Dek70 Plus': 'dek70-plus',
  'Dek-70 Camp': 'dek70-camp-first',
}

/** ชื่อกิจกรรม → slug ที่อ่านออกบน URL */
function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * ไฟล์ที่ไม่เอาขึ้นเว็บตามที่เจ้าของข้อมูลสั่ง — เก็บ CSV ไว้เฉย ๆ เผื่อกลับมาใช้
 * Dek70 เหลือแค่ค่ายที่ 1 กับที่ 2 ไม่เอา Dek70 Plus และ Dek70 Plus+
 */
const EXCLUDED = new Set(['Dek70_Plus_Camp.csv', 'Dek70_Final_Round.csv'])

const files = (await readdir(SOURCE))
  .filter((name) => name.endsWith('.csv') && !EXCLUDED.has(name))
  .sort()
const activities = []

for (const file of files) {
  const rows = parseCsv(await readFile(path.join(SOURCE, file), 'utf8'))
  const record = {}
  for (const row of rows) {
    const key = FIELDS[row[0]?.trim()]
    if (key) record[key] = (row[1] ?? '').trim()
  }
  if (!record.title) {
    console.warn(`ข้าม ${file}: ไม่มีชื่อกิจกรรม`)
    continue
  }

  activities.push({
    slug: SLUG_OVERRIDES[record.title.trim()] ?? toSlug(record.title),
    source: file,
    title: record.title,
    summary: record.summary ?? '',
    categories: (record.categories ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    dateStart: record.dateStart ?? '',
    dateEnd: record.dateEnd ?? '',
    scheduleNote: record.scheduleNote ?? '',
    applyDeadline: record.applyDeadline ?? '',
    capacity: record.capacity ?? '',
    fee: record.fee ?? '',
    eligibility: record.eligibility ?? '',
    extraRequirement: record.extraRequirement ?? '',
    applyUrl: record.applyUrl ?? '',
    description: (record.description ?? '')
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line, index, all) => !(line === '' && all[index - 1] === '')),
  })
}

// ชื่อกิจกรรมสองรายการอาจให้ slug เดียวกัน (เช่น "Dek70 Plus" กับ "Dek70 Plus+")
// เติมเลขต่อท้ายให้ตัวหลัง แล้วบอกไว้ เพื่อให้แก้ชื่อใน CSV ได้ถ้าต้องการ
const seen = new Map()
for (const item of activities) {
  const count = (seen.get(item.slug) ?? 0) + 1
  seen.set(item.slug, count)
  if (count > 1) {
    const next = `${item.slug}-${count}`
    console.warn(`slug ซ้ำ: "${item.title}" (${item.source}) → ${next}`)
    item.slug = next
  }
}

const body = `// ไฟล์นี้สร้างจาก data/source/activities/*.csv
// แก้ที่ CSV แล้วรัน: node scripts/import-activities.mjs
// อย่าแก้ไฟล์นี้ด้วยมือ

import type { RealActivity } from './activity-types'

export const realActivities: RealActivity[] = ${JSON.stringify(
  activities.map(({ source, ...rest }) => rest),
  null,
  2
)}
`

await writeFile(TARGET, body)
console.log(`เขียน ${activities.length} กิจกรรมลง ${TARGET}`)
activities.forEach((item) =>
  console.log(` - ${item.slug.padEnd(28)} ${item.title} (${item.description.length} บรรทัด)`)
)
