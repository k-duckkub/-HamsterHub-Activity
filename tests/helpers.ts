import type { Page } from '@playwright/test'

/** ข้ามอินโทรไดโนเสาร์ เพื่อให้เทสต์ที่ไม่ได้ตรวจอินโทรเดินเร็วและแน่นอน */
export async function markIntroSeen(page: Page): Promise<void> {
  await page.addInitScript(() =>
    sessionStorage.setItem('hamsterhub-activity-intro-seen', 'true')
  )
}

/** เปิดสิทธิ์คลิปบอร์ดไว้ เพื่อให้เทสต์แชร์อ่านค่าที่คัดลอกได้ */
export const CLIPBOARD_PERMISSIONS = ['clipboard-read', 'clipboard-write'] as const
