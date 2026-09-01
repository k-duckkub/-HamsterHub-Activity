'use client'

import type { Space } from '@/data/spaces'
import SpaceIcon from './SpaceIcon'

type ActivityArtProps = {
  space: Space
  /** ขนาดของไอคอนตอนที่ยังไม่มีรูปปกจริง เช่น "w-[54%]" */
  iconClassName?: string
}

/**
 * งานศิลป์ของกิจกรรมหนึ่งใบ
 * มีรูปปกจริงเมื่อไหร่ก็เต็มกรอบ ถ้ายังไม่มีก็เป็นไอคอนจาก sprite sheet เหมือนเดิม
 */
export default function ActivityArt({ space, iconClassName = 'w-[54%]' }: ActivityArtProps) {
  if (space.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={space.cover.src}
        alt={space.title}
        width={space.cover.width}
        height={space.cover.height}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  return (
    <span className={`block overflow-hidden rounded-[10px] ${iconClassName}`}>
      <SpaceIcon position={space.iconPosition} title={space.title} />
    </span>
  )
}
