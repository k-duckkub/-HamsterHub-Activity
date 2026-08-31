'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'hamsterhub:likes:v1'

export type LikeKind = 'activity' | 'project'

type LikeMap = Record<string, boolean>

function read(): LikeMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, boolean] => typeof entry[1] === 'boolean'
      )
    )
  } catch {
    return {}
  }
}

function write(map: LikeMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* โหมดส่วนตัวบางเบราว์เซอร์เขียนไม่ได้ ปล่อยผ่าน */
  }
}

/**
 * จำว่าถูกใจอะไรไว้บ้างใน localStorage
 * เริ่มที่ false เสมอในเฟรมแรก แล้วค่อยอ่านค่าจริงหลัง mount
 * เพื่อให้ HTML ฝั่งเซิร์ฟเวอร์กับฝั่งเบราว์เซอร์ตรงกัน
 */
export function usePersistentLike(kind: LikeKind, id: string) {
  const key = `${kind}:${id}`
  const [liked, setLiked] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLiked(read()[key] === true)
    setHydrated(true)
  }, [key])

  const toggle = useCallback(() => {
    setLiked((current) => {
      const next = !current
      const map = read()
      if (next) map[key] = true
      else delete map[key]
      write(map)
      return next
    })
  }, [key])

  return { liked, toggle, hydrated }
}
