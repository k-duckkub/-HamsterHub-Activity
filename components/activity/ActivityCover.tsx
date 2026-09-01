'use client'

import Image from 'next/image'
import type { Space } from '@/data/spaces'
import SpaceIcon from '@/components/explore/SpaceIcon'

type ActivityCoverProps = {
  space: Space
  priority?: boolean
  className?: string
  sizes?: string
  /** ขนาดของไอคอนสำรอง ใช้เฉพาะกิจกรรมที่ยังไม่มีไฟล์ปกจริง */
  iconClassName?: string
}

/**
 * กรอบรูปปกของกิจกรรม
 * มีไฟล์จริงก็เต็มกรอบด้วย object-cover (ครอปตอนแสดงผลเท่านั้น ไฟล์ต้นฉบับไม่ถูกแตะ)
 * ยังไม่มีไฟล์ก็ใช้ไอคอนจาก sprite sheet บนคู่สีของกิจกรรมนั้น ไม่มีการใส่ภาพแทน
 */
export default function ActivityCover({
  space,
  priority = false,
  className = '',
  sizes = '100vw',
  iconClassName = 'w-[46%]',
}: ActivityCoverProps) {
  return (
    <div className={`relative isolate grid place-items-center overflow-hidden ${className}`}>
      {space.coverImage ? (
        <Image
          src={space.coverImage}
          alt={space.coverAlt ?? space.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: space.coverPosition ?? 'center' }}
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 150% at 70% 20%, ${space.accent}59 0%, ${space.background} 70%)`,
            }}
          />
          <span className={`relative block overflow-hidden rounded-[10px] ${iconClassName}`}>
            <SpaceIcon position={space.iconPosition} title={space.title} />
          </span>
        </>
      )}
    </div>
  )
}
