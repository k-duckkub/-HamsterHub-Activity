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

test.describe('เลื่อนลงจากหน้าแรก', () => {
  // ล้อเมาส์มีเฉพาะบนเดสก์ท็อป จอสัมผัสใช้การลากนิ้วขึ้นแทน
  test.skip(({ isMobile }) => Boolean(isMobile), 'จอสัมผัสไม่มีล้อเมาส์')

  test('เลื่อนล้อเมาส์ลงแล้วเข้าหน้ากิจกรรมที่เลือกอยู่', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore')
    const chosen = await page.getByRole('option').first().getAttribute('aria-label')
    expect(chosen).toBeTruthy()

    await page.mouse.wheel(0, 150)
    await page.waitForURL(/\/activity\/[^/]+$/, { timeout: 12000 })
    await expect(page.locator('h1')).toHaveText(chosen ?? '')
  })

  test('เลื่อนขึ้นไม่พาไปไหน', async ({ page }) => {
    await markIntroSeen(page)
    await page.goto('/explore')
    await page.mouse.wheel(0, -400)
    await page.waitForTimeout(600)
    expect(new URL(page.url()).pathname).toBe('/explore')
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

  test('มีแถบดำแบบคัตซีนระหว่างฉาก แล้วเก็บออกตอนจบ', async ({ page }) => {
    await page.goto('/explore')
    await page.getByRole('option').first().click()

    // ระหว่างฉาก แถบบนต้องเลื่อนลงมาอยู่ในจอจริง ไม่ใช่ซ่อนอยู่นอกจอ
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const top = document.querySelector('.activity-intro-bar')
            return top ? Math.round(top.getBoundingClientRect().bottom) : -1
          }),
        { timeout: 4000 }
      )
      .toBeGreaterThan(0)

    // จบฉากแล้ว overlay ต้องหายไปทั้งชั้น แถบดำจึงไม่ค้างทับหน้าเว็บ
    await expect(page.locator('.activity-intro-layer')).toHaveCount(0, { timeout: 9000 })
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

test.describe('ไฟตรงปากมังกร', () => {
  test('โคนไฟอยู่ที่ปากมังกร ไม่ลอยห่างออกไป', async ({ page }) => {
    await page.goto('/explore')
    await page.getByRole('option').first().click()

    // รอจนไฟขึ้นจริง แล้ววัดระยะจากโคนไฟถึงปากมังกรด้วยสัดส่วนเดียวกับที่โค้ดใช้
    const gap = await page.waitForFunction(
      () => {
        const layers = document.querySelectorAll('.activity-intro-layer')
        const dragonImg = layers[2]?.querySelector('img')
        const fireBox = layers[3]?.getBoundingClientRect()
        const fireImg = layers[3]?.querySelector('img')
        if (!(dragonImg instanceof HTMLImageElement) || !fireBox) return false
        if (!(fireImg instanceof HTMLImageElement) || !fireImg.naturalWidth) return false
        if (Number(getComputedStyle(layers[3] as Element).opacity) < 0.6) return false

        const dino = dragonImg.getBoundingClientRect()
        const scale = Math.min(
          fireBox.width / fireImg.naturalWidth,
          fireBox.height / fireImg.naturalHeight
        )
        const width = fireImg.naturalWidth * scale
        const height = fireImg.naturalHeight * scale
        const jet = {
          x: fireBox.left + (fireBox.width - width) / 2 + width * 0.02,
          y: fireBox.top + (fireBox.height - height) / 2 + height * 0.6,
        }
        const mouth = { x: dino.left + dino.width * 0.7, y: dino.top + dino.height * 0.4 }
        return Math.round(Math.hypot(jet.x - mouth.x, jet.y - mouth.y))
      },
      undefined,
      { timeout: 9000 }
    )

    // เผื่อการสั่นของมังกรตอนพ่นไฟไว้พอสมควร แต่ห่างเป็นร้อยพิกเซลคือหลุด
    expect(await gap.jsonValue()).toBeLessThan(110)
  })
})

test.describe('อินโทรเมื่อเน็ตไม่เป็นใจ', () => {
  test('ภาพมาช้า แล้วผู้ใช้กดทันที ก็ยังได้อินโทร', async ({ page, context }) => {
    // จำลองไฟล์ภาพที่มาช้ากว่านิ้วผู้ใช้ ซึ่งเป็นสถานการณ์จริงบนเน็ตมือถือ
    await context.route('**/assets/activity-intro/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      await route.continue()
    })

    await page.goto('/explore', { waitUntil: 'domcontentloaded' })
    await page.getByRole('option').first().click()
    await expect(page.locator('.activity-intro-layer').first()).toBeAttached()
    await page.waitForURL(/\/activity\/[^/]+$/)
    await expect(page.locator('.activity-intro-layer')).toHaveCount(0, { timeout: 10000 })
  })

  test('โหลดภาพไม่ได้เลย ก็ยังเข้าหน้ากิจกรรมได้ ไม่ค้างจอ', async ({ page, context }) => {
    await context.route('**/assets/activity-intro/**', (route) => route.abort())

    await page.goto('/explore')
    await page.getByRole('option').first().click()
    await page.waitForURL(/\/activity\/[^/]+$/, { timeout: 5000 })
    await expect(page.locator('.activity-intro-layer')).toHaveCount(0)
  })
})
