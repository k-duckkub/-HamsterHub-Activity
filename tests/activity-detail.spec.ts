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
