import { expect, test } from '@playwright/test'
import { markIntroSeen } from './helpers'

test.beforeEach(async ({ page }) => {
  await markIntroSeen(page)
})

test('เดินด้วยคีย์บอร์ดถึงปุ่มหลักของหน้ากิจกรรมได้', async ({ page }) => {
  await page.goto('/activity/game-jam-x')
  const like = page.getByRole('button', { name: /ถูกใจกิจกรรมนี้/ })
  await like.focus()
  await expect(like).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: /เลิกถูกใจกิจกรรมนี้/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('ปุ่มเรียงลำดับใช้ semantic ที่ถูกต้อง', async ({ page }) => {
  await page.goto('/activity/game-jam-x/projects')
  const group = page.getByRole('group', { name: 'เรียงลำดับผลงาน' })
  await expect(group.getByRole('button', { name: 'ล่าสุด' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await group.getByRole('button', { name: 'ยอดนิยม' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/sort=popular/)
})

test('toast ประกาศผลผ่าน live region', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'สิทธิ์คลิปบอร์ดใช้ได้กับ Chromium')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
  })
  await page.goto('/activity/game-jam-x/projects')
  await page.locator('main article button[aria-label^="แชร์"]').first().click()

  const status = page.getByRole('status')
  await expect(status).toHaveAttribute('aria-live', 'polite')
  await expect(status).toContainText('คัดลอกลิงก์แล้ว')
})

test('ปุ่มเพิ่มผลงานเปิด dialog ที่บอกว่ายังไม่เปิดใช้งาน', async ({ page }) => {
  await page.goto('/activity/game-jam-x/projects')
  const add = page.getByRole('button', { name: /เพิ่มผลงาน/ })
  await add.scrollIntoViewIfNeeded()
  await add.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('ระบบส่งผลงานกำลังเตรียมเปิดใช้งาน')
  await expect(dialog.locator('form')).toHaveCount(0)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(add).toBeFocused()
})

test('หน้าไม่มี console error ระหว่างใช้งานปกติ', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  for (const path of [
    '/explore',
    '/activity/game-jam-x',
    '/activity/game-jam-x/projects',
    '/activity/game-jam-x/projects/gx-1',
    '/creators/petchdev',
    '/projects',
  ]) {
    await page.goto(path, { waitUntil: 'networkidle' })
  }

  expect(errors).toEqual([])
})
