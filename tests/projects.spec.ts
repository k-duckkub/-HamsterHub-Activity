import { expect, test } from '@playwright/test'
import { markIntroSeen } from './helpers'

const FEED = '/activity/game-jam-x/projects'

test.beforeEach(async ({ page }) => {
  await markIntroSeen(page)
})

test('เรียงลำดับเปลี่ยน URL และลำดับรายการ', async ({ page }) => {
  await page.goto(FEED)
  const first = page.locator('main article h3').first()
  const latest = await first.innerText()

  await page.getByRole('button', { name: 'ยอดนิยม' }).click()
  await expect(page).toHaveURL(/sort=popular/)
  await expect(page.getByRole('button', { name: 'ยอดนิยม' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await expect(first).not.toHaveText(latest)

  await page.getByRole('button', { name: 'ล่าสุด' }).click()
  await expect(page).not.toHaveURL(/sort=popular/)
  await expect(first).toHaveText(latest)
})

test('เปิดลิงก์ที่มี sort อยู่แล้วยังคงค่าเดิม', async ({ page }) => {
  await page.goto(`${FEED}?sort=popular`)
  await expect(page.getByRole('button', { name: 'ยอดนิยม' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('การ์ดพาไปหน้าผลงาน และชื่อผู้สร้างพาไปหน้าโปรไฟล์', async ({ page }) => {
  await page.goto(FEED)
  const card = page.locator('main article').first()
  const creator = await card.locator('a[href^="/creators/"]').first().innerText()

  await card.locator('a[href*="/projects/"]').first().click()
  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/)

  await page.goBack()
  await page.locator('main article a[href^="/creators/"]').first().click()
  await expect(page).toHaveURL(/\/creators\//)
  await expect(page.locator('h1')).toContainText(creator)
})

test('หัวใจบนการ์ดไม่พาไปหน้าอื่น และจำค่าไว้', async ({ page }) => {
  await page.goto(FEED)
  const like = page.locator('main article button[aria-pressed]').first()
  await like.click()
  await expect(page).toHaveURL(new RegExp(`${FEED}$`))
  await expect(like).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.locator('main article button[aria-pressed]').first()).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('หน้ารวมผลงานทั้งหมดเปิดได้และเรียงได้', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.locator('h1')).toContainText('ผลงานทั้งหมด')
  await page.getByRole('button', { name: 'ยอดนิยม' }).click()
  await expect(page).toHaveURL(/sort=popular/)
})

test('slug ที่ไม่มีอยู่จริงตอบ 404 ไม่ใช่หน้าว่าง', async ({ page }) => {
  const creator = await page.goto('/creators/no-such-creator')
  expect(creator?.status()).toBe(404)

  const activity = await page.goto('/activity/no-such-activity')
  expect(activity?.status()).toBe(404)
})
