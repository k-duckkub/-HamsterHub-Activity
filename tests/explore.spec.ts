import { expect, test } from '@playwright/test'
import { markIntroSeen } from './helpers'

test.describe('หน้า Explore', () => {
  test('โหลดได้และแสดงการ์ดกิจกรรม', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore')
    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByRole('option').first()).toBeVisible()
  })

  test('เลื่อนเลือกกิจกรรมด้วยลูกศรซ้ายและขวาได้', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore')
    const tiles = page.getByRole('option')
    await expect(tiles.first()).toBeVisible()

    const selected = () => page.locator('[role="option"][aria-selected="true"]').first()
    // ลูกศรทำงานเมื่อโฟกัสอยู่ที่การ์ด
    await selected().focus()
    const before = await selected().getAttribute('aria-label')

    await page.keyboard.press('ArrowRight')
    await expect(selected()).not.toHaveAttribute('aria-label', before ?? '')

    await page.keyboard.press('ArrowLeft')
    await expect(selected()).toHaveAttribute('aria-label', before ?? '')
  })

  test('กดการ์ดแล้วไปหน้ารายละเอียดกิจกรรม', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore')
    await page.getByRole('option').first().click()
    await page.waitForURL(/\/activity\/[^/]+$/)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('อินโทรไดโนเสาร์', () => {
  test('เล่นแล้วถอด overlay ออกเมื่อจบ', async ({ page }) => {
    await page.goto('/explore')
    await page.getByRole('option').first().click()
    await expect(page.locator('.activity-intro-layer').first()).toBeVisible()
    await page.waitForURL(/\/activity\/[^/]+$/)
    await expect(page.locator('.activity-intro-layer')).toHaveCount(0, { timeout: 8000 })
  })

  test('replayIntro=1 เล่นซ้ำแม้เคยดูแล้ว', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore?replayIntro=1')
    await page.getByRole('option').first().click()
    await expect(page.locator('.activity-intro-layer').first()).toBeVisible()
  })

  test('เปิด reduced motion แล้วข้ามอินโทร', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/explore')
    await page.getByRole('option').first().click()
    await page.waitForURL(/\/activity\/[^/]+$/)
    await expect(page.locator('.activity-intro-layer')).toHaveCount(0)
  })
})
