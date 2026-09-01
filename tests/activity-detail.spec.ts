import { expect, test } from '@playwright/test'
import { markIntroSeen } from './helpers'

const ACTIVITY = '/activity/tech-booster-for-teens'

test.beforeEach(async ({ page }) => {
  await markIntroSeen(page)
})

test('เปิด URL ตรง ๆ แล้วหน้าโหลดครบ', async ({ page }) => {
  await page.goto(ACTIVITY)
  await expect(page.locator('h1')).toContainText('Tech Booster')
  await expect(page.getByRole('button', { name: /ถูกใจกิจกรรมนี้/ })).toBeVisible()
})

test('ปุ่ม ดูผลงาน พาไปหน้าผลงานของกิจกรรมนั้น', async ({ page }) => {
  await page.goto(ACTIVITY)
  await page.getByRole('button', { name: 'ดูผลงาน' }).click()
  await expect(page).toHaveURL(/\/activity\/tech-booster-for-teens\/projects$/)
})

test('ปุ่ม กลับไป พากลับหน้ารายละเอียด', async ({ page }) => {
  await page.goto(`${ACTIVITY}/projects`)
  await page.getByRole('button', { name: 'กลับไป' }).click()
  await expect(page).toHaveURL(/\/activity\/tech-booster-for-teens$/)
})

test('หัวใจจำค่าไว้หลังรีโหลด', async ({ page }) => {
  await page.goto(ACTIVITY)
  const like = page.getByRole('button', { name: /ถูกใจกิจกรรมนี้/ })
  await expect(like).toHaveAttribute('aria-pressed', 'false')

  await like.click()
  await expect(page.getByRole('button', { name: /เลิกถูกใจกิจกรรมนี้/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  )

  await page.reload()
  await expect(page.getByRole('button', { name: /เลิกถูกใจกิจกรรมนี้/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('แชร์คัดลอกลิงก์ของกิจกรรมนั้นแล้วขึ้นข้อความ', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'สิทธิ์คลิปบอร์ดใช้ได้กับ Chromium')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  // ตัด native share sheet ออก เพื่อบังคับให้ใช้ทางคลิปบอร์ด
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
  })
  await page.goto(ACTIVITY)
  await page.getByRole('button', { name: 'แชร์กิจกรรมนี้' }).click()

  await expect(page.getByRole('status')).toContainText('คัดลอกลิงก์แล้ว')
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('/activity/tech-booster-for-teens')
})

test('คำสำคัญในคำอธิบายขึ้นสีส้ม', async ({ page }) => {
  await page.goto(ACTIVITY)
  const highlighted = page.locator('main section .text-primary')
  await expect(highlighted.first()).toBeVisible()
  expect(await highlighted.count()).toBeGreaterThan(3)

  // ต้องเป็นคำที่มีอยู่จริงในข้อมูล ไม่ใช่คำที่จับผิดกลางคำอื่น
  const words = await highlighted.allInnerTexts()
  expect(words).toContain('Hamster Hub')
})

test('ช่องข้อมูลจริงจาก CSV แสดงครบ', async ({ page }) => {
  await page.goto(ACTIVITY)
  const box = page.locator('main section').first()
  for (const label of ['วันที่จัด', 'เวลา/วันที่สอน', 'รับสมัครถึง', 'จำนวนที่รับ', 'ค่าใช้จ่าย']) {
    await expect(box.getByText(label, { exact: true })).toBeVisible()
  }
})

test('แถบกิจกรรมอื่นเว้นระยะปกติ ไม่ยืดจนเป็นช่องว่าง', async ({ page }) => {
  // หน้าที่คำอธิบายยาวที่สุด เคยทำให้รายการในแถบถูกยืดออกจากกัน
  await page.goto('/activity/nsc-software-project-2026')
  const gaps = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('aside article')].map((n) =>
      n.getBoundingClientRect()
    )
    return boxes.slice(1).map((box, index) => Math.round(box.top - boxes[index]!.bottom))
  })
  expect(gaps.length).toBeGreaterThan(0)
  for (const gap of gaps) expect(gap).toBeLessThan(40)
})

test.describe('รูปปกจริงของกิจกรรม', () => {
  test('กิจกรรมที่มีไฟล์ปกจริงแสดงรูปนั้น ไม่ใช่ไอคอนสำรอง', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/activity/scigame-lab-camp')

    const cover = page.locator('main img[alt*="SciGame Lab Camp"]').first()
    await expect(cover).toBeVisible()

    // ต้องโหลดสำเร็จจริง ไม่ใช่กรอบว่างที่ alt ยังอยู่
    const loaded = await cover.evaluate(
      (node) => node instanceof HTMLImageElement && node.naturalWidth > 0
    )
    expect(loaded).toBe(true)
  })

  test('กิจกรรมที่ยังไม่มีไฟล์ปกยังใช้ไอคอนเดิม ไม่ใช่กรอบว่าง', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/activity/starlight')
    await expect(page.locator('main [role="img"]').first()).toBeVisible()
  })
})

test.describe('แถบกิจกรรมอื่น', () => {
  test('แสดงกิจกรรมที่เหลือครบทุกรายการ และเลื่อนดูต่อได้', async ({ page }) => {
    await markIntroSeen(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/activity/kid-day')

    // ข้อมูลจริงมี 19 กิจกรรม หน้านี้เป็นหนึ่งในนั้น จึงต้องเหลือ 18 ใบในแถบ
    await expect(page.locator('aside article')).toHaveCount(18)

    const rail = page.locator('aside > div').last()
    const scrolled = await rail.evaluate((node) => {
      node.scrollTop = node.scrollHeight
      return node.scrollTop > 0
    })
    expect(scrolled).toBe(true)
  })
})
