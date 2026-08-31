export type ShareResult = 'shared' | 'copied' | 'failed'

export type SharePayload = {
  title: string
  /** path ภายในเว็บ เช่น /activity/game-jam-x */
  path: string
  text?: string
}

/** ลิงก์เต็มของรายการนั้น ใช้ทั้งแชร์และคัดลอก */
export function canonicalUrl(path: string): string {
  if (typeof window === 'undefined') {
    return `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}${path}`
  }
  return new URL(path, window.location.origin).toString()
}

/** วิธีสุดท้ายเมื่อ clipboard API ใช้ไม่ได้ (http หรือเบราว์เซอร์เก่า) */
function copyWithTextarea(value: string): boolean {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

/**
 * แชร์ด้วยหน้าต่างของระบบถ้ามี ไม่มีก็คัดลอกลิงก์ลงคลิปบอร์ด
 * คืนค่าให้ผู้เรียกไปขึ้น toast ตามผลจริง
 */
export async function shareLink(payload: SharePayload): Promise<ShareResult> {
  const url = canonicalUrl(payload.path)

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: payload.title, text: payload.text, url })
      return 'shared'
    } catch (error) {
      // ผู้ใช้กดยกเลิกเอง ไม่ใช่ความผิดพลาด และไม่ต้องคัดลอกต่อ
      if (error instanceof DOMException && error.name === 'AbortError') return 'shared'
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return 'copied'
    }
  } catch {
    /* ตกไปใช้ textarea ข้างล่าง */
  }

  return copyWithTextarea(url) ? 'copied' : 'failed'
}

export const SHARE_MESSAGE: Record<ShareResult, string | null> = {
  shared: null,
  copied: 'คัดลอกลิงก์แล้ว',
  failed: 'ไม่สามารถคัดลอกลิงก์ได้',
}
