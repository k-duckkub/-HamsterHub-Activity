'use client'

import { useEffect } from 'react'
import { SPACE_ICON_SHEET } from '@/data/spaces'

let checked = false

/** เตือนครั้งเดียวเมื่อไม่พบ sprite sheet — ไม่แทนที่ด้วย placeholder ใด ๆ */
function useSpriteSheetCheck(): void {
  useEffect(() => {
    if (checked) return
    checked = true
    const probe = new Image()
    probe.onerror = () => {
      console.error('Missing /public/assets/hamsterhub-space-icons.png')
    }
    probe.src = SPACE_ICON_SHEET
  }, [])
}

type SpaceIconProps = {
  position: string
  title: string
  className?: string
}

export default function SpaceIcon({ position, title, className = '' }: SpaceIconProps) {
  useSpriteSheetCheck()

  return (
    <div
      role="img"
      aria-label={`${title} icon`}
      className={`space-icon ${className}`}
      style={{ backgroundPosition: position }}
    />
  )
}
