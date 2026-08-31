/**
 * ตัวกลางเล็ก ๆ ระหว่างหน้า Explore กับ overlay ที่อยู่ใน layout
 * ต้องอยู่นอก React tree ของหน้า เพราะ overlay ต้องรอดข้ามการเปลี่ยน route
 */

export type IntroRequest = { destination: string }

type Listener = (request: IntroRequest) => void

const listeners = new Set<Listener>()

export const SEEN_KEY = 'hamsterhub-activity-intro-seen'

/** โหมดการเล่น — ค่าเริ่มต้นคือเล่นครั้งแรกครั้งเดียวต่อ session */
export const INTRO_PLAY_MODE: 'once-per-session' | 'every-entry' | 'manual' =
  'once-per-session'

export function onIntroRequest(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function requestIntro(request: IntroRequest): void {
  listeners.forEach((listener) => listener(request))
}

/** เคยดูอินโทรไปแล้วใน session นี้หรือยัง */
export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, 'true')
  } catch {
    /* โหมดส่วนตัวบางเบราว์เซอร์เขียนไม่ได้ ปล่อยผ่าน */
  }
}

/** เปิดอินโทรซ้ำเพื่อทดสอบด้วย ?replayIntro=1 */
export function isReplayRequested(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('replayIntro') === '1'
}

export function shouldPlayIntro(): boolean {
  if (INTRO_PLAY_MODE === 'manual') return false
  if (isReplayRequested()) return true
  if (INTRO_PLAY_MODE === 'every-entry') return true
  return !hasSeenIntro()
}
