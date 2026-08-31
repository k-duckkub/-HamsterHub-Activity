import { expect, test } from '@playwright/test'
import { markIntroSeen } from './helpers'

// เมนูแฮมเบอร์เกอร์มีเฉพาะจอเล็ก
test.use({ viewport: { width: 390, height: 844 } })

test.beforeEach(async ({ page }) => {
  await markIntroSeen(page)
  await page.goto('/activity/tech-booster-for-teens')
})

test('เปิดเมนูแล้วปิดด้วยปุ่ม X', async ({ page }) => {
  await page.getByRole('button', { name: 'เปิดเมนู' }).click()
  const dialog = page.getByRole('dialog', { name: 'เมนูหลัก' })
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: 'ปิดเมนู' }).click()
  await expect(dialog).toBeHidden()
})

test('Escape ปิดเมนูและคืนโฟกัสให้ปุ่มเปิด', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'เปิดเมนู' })
  await opener.click()
  await expect(page.getByRole('dialog', { name: 'เมนูหลัก' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'เมนูหลัก' })).toBeHidden()
  await expect(opener).toBeFocused()
})

test('แตะฉากหลังก็ปิดเมนู', async ({ page }) => {
  await page.getByRole('button', { name: 'เปิดเมนู' }).click()
  // แตะกลางฝั่งซ้าย ซึ่งเป็นฉากหลัง ไม่ใช่แผ่นเมนูที่อยู่ทางขวา
  await page.mouse.click(40, 400)
  await expect(page.getByRole('dialog', { name: 'เมนูหลัก' })).toBeHidden()
})

test('เมนูที่ยังไม่มีหน้าจริงขึ้นว่าเร็ว ๆ นี้ และกดไม่ได้', async ({ page }) => {
  await page.getByRole('button', { name: 'เปิดเมนู' }).click()
  const dialog = page.getByRole('dialog', { name: 'เมนูหลัก' })
  const coming = dialog.locator('[aria-disabled="true"]')
  await expect(coming.first()).toContainText('เร็ว ๆ นี้')
  await expect(dialog.locator('a[href="/explore"]')).toHaveCount(1)
})

test('Project Showcase ในเมนูพาไปหน้ารวมผลงาน', async ({ page }) => {
  await page.getByRole('button', { name: 'เปิดเมนู' }).click()
  await page.getByRole('dialog').getByRole('link', { name: /Project Showcase/ }).click()
  await expect(page).toHaveURL(/\/projects$/)
})

test('ล็อกการเลื่อนหน้าระหว่างเปิดเมนู', async ({ page }) => {
  await page.getByRole('button', { name: 'เปิดเมนู' }).click()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('hidden')
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('แท็บ คุณ ยังไม่เปิดใช้งาน จึงไม่มีลิงก์', async ({ page }) => {
  const bar = page.getByRole('navigation', { name: 'แถบเมนูด้านล่าง' })
  await expect(bar.getByText('คุณ')).toBeVisible()
  await expect(bar.locator('[aria-disabled="true"]')).toHaveCount(1)
})
