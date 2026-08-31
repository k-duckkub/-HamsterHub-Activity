'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** ไฟล์ที่อินโทรต้องใช้ — แต่ละช่องลองชื่อไหนก็ได้ที่มีอยู่จริง */
export const INTRO_ASSETS = {
  dinosaur: ['/assets/activity-intro/cute-baby-dragon.png', '/assets/activity-intro/dinosaur.png'],
  hand: [
    '/assets/activity-intro/giant-hamster-grab.png',
    '/assets/activity-intro/hamster-hand.png',
  ],
  fire: ['/assets/activity-intro/cute-fire-overlay.png', '/assets/activity-intro/fire.webm'],
  smoke: ['/assets/activity-intro/soft-smoke-reveal.png', '/assets/activity-intro/smoke.webm'],
} as const

export const INTRO_SOUNDS = {
  fire: '/assets/activity-intro/fire-whoosh.mp3',
  grab: '/assets/activity-intro/grab-pop.mp3',
  reveal: '/assets/activity-intro/reveal.mp3',
} as const

export type IntroSlot = keyof typeof INTRO_ASSETS

/** จอเล็กใช้ไฟล์ที่ย่อไว้แล้ว เดสก์ท็อปใช้ต้นฉบับ ไม่โหลดข้ามกัน */
const MOBILE_QUERY = '(max-width: 767px)'

function forViewport(url: string, mobile: boolean): string {
  if (!mobile) return url
  return url.replace('/activity-intro/', '/activity-intro/mobile/')
}

export type IntroAssets = Record<IntroSlot, string | null>

export const MUTE_KEY = 'hamsterhub-activity-intro-muted'

/**
 * ผลการตรวจไฟล์เสียง เก็บไว้ทั้ง session
 * ตรวจเฉพาะตอนที่อินโทรจะเล่นจริง หน้าอื่นจึงไม่ยิง request ทิ้ง
 */
let soundCache: Record<string, boolean> | null = null

/** ผลการหาไฟล์ภาพ เก็บไว้ทั้ง session จะได้ตรวจครั้งเดียวจริง ๆ */
let assetCache: IntroAssets | null = null

const EMPTY_ASSETS: IntroAssets = { dinosaur: null, hand: null, fire: null, smoke: null }

/** มีไฟล์นี้อยู่จริงไหม ถามด้วย HEAD เพื่อไม่ดึงทั้งไฟล์ */
async function exists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'force-cache' })
    return response.ok && (response.headers.get('content-length') ?? '1') !== '0'
  } catch {
    return false
  }
}

async function resolveSlot(
  candidates: readonly string[],
  mobile: boolean
): Promise<string | null> {
  for (const candidate of candidates) {
    // ลองไฟล์ของอุปกรณ์นั้นก่อน ถ้ายังไม่ได้สร้างไว้ค่อยถอยไปใช้ต้นฉบับ
    const preferred = forViewport(candidate, mobile)
    if (preferred !== candidate && (await exists(preferred))) return preferred
    if (await exists(candidate)) return candidate
  }
  return null
}

/**
 * ตรวจว่าไฟล์อินโทรมีครบไหม แล้วโหลดไว้ล่วงหน้า
 * ขาดไฟล์ไหนจะบอกชื่อไฟล์นั้นทาง console แล้วให้ผู้เรียกใช้ทางลัดแทน
 */
export function useActivityIntro({ enabled = true }: { enabled?: boolean } = {}) {
  const [assets, setAssets] = useState<IntroAssets>(assetCache ?? EMPTY_ASSETS)
  const [checked, setChecked] = useState(assetCache !== null)
  const [muted, setMuted] = useState(true)
  const [sounds, setSounds] = useState<Record<string, boolean>>(soundCache ?? {})
  const preloaded = useRef(false)

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === 'true')
    } catch {
      /* อ่านไม่ได้ก็ถือว่าเปิดเสียง */
      setMuted(false)
    }
  }, [])

  useEffect(() => {
    // ตรวจเฉพาะหน้าที่ต้องใช้จริง และตรวจครั้งเดียวต่อ session
    if (!enabled || assetCache) return
    let alive = true

    // อ่านขนาดจอหลัง mount เท่านั้น ฝั่งเซิร์ฟเวอร์จึงไม่ต้องเดาอุปกรณ์
    const mobile = window.matchMedia(MOBILE_QUERY).matches

    void (async () => {
      const entries = await Promise.all(
        (Object.keys(INTRO_ASSETS) as IntroSlot[]).map(
          async (slot) => [slot, await resolveSlot(INTRO_ASSETS[slot], mobile)] as const
        )
      )
      if (!alive) return

      const resolved = Object.fromEntries(entries) as IntroAssets
      const missing = entries
        .filter(([, url]) => url === null)
        .map(([slot]) => INTRO_ASSETS[slot][0])

      if (missing.length > 0) {
        console.error(
          `Missing activity intro assets: ${missing.join(', ')} — ใช้การเปลี่ยนหน้าแบบสั้นแทน`
        )
      }
      assetCache = resolved
      setAssets(resolved)
      setChecked(true)
    })()

    return () => {
      alive = false
    }
  }, [enabled])

  const ready =
    checked && (Object.values(assets) as (string | null)[]).every((url) => url !== null)

  /** โหลดภาพและเฟรมแรกของวิดีโอไว้ก่อนผู้ใช้กด */
  const preload = useCallback(() => {
    if (preloaded.current || !ready) return
    preloaded.current = true

    ;(Object.values(assets) as (string | null)[]).forEach((url) => {
      if (!url) return
      if (url.endsWith('.webm')) {
        const video = document.createElement('video')
        video.preload = 'auto'
        video.muted = true
        video.src = url
        video.load()
        return
      }
      const image = new Image()
      image.src = url
    })
  }, [assets, ready])

  const toggleMuted = useCallback(() => {
    setMuted((value) => {
      const next = !value
      try {
        localStorage.setItem(MUTE_KEY, String(next))
      } catch {
        /* เขียนไม่ได้ก็จำแค่ใน session นี้ */
      }
      return next
    })
  }, [])

  const hasSound = useCallback((url: string) => sounds[url] === true, [sounds])

  /** เรียกตอนอินโทรเริ่มเท่านั้น */
  const checkSounds = useCallback(async () => {
    if (soundCache) return
    const entries = await Promise.all(
      Object.values(INTRO_SOUNDS).map(async (url) => [url, await exists(url)] as const)
    )
    soundCache = Object.fromEntries(entries)
    setSounds(soundCache)
  }, [])

  return { assets, ready, checked, preload, muted, toggleMuted, hasSound, checkSounds }
}
