'use client'

import Image from 'next/image'
import type { Space } from '@/data/spaces'
import SpaceIcon from './SpaceIcon'

type ActivityArtProps = {
  space: Space
  /** ขนาดของไอคอนตอนที่ยังไม่มีรูปปกจริง เช่น "w-[54%]" */
  iconClassName?: string
  /** ความกว้างที่ภาพนี้กินจริงในแต่ละขนาดจอ ส่งต่อให้ next/image เลือกไฟล์ */
  sizes?: string
  /** ปกใบเด่นของหน้าควรโหลดก่อน ไม่ต้องรอ lazy load */
  priority?: boolean
  /**
   * 'contain' เห็นโปสเตอร์ทั้งใบ เหมาะกับที่ที่ต้องอ่านข้อความบนภาพ
   * 'cover' เต็มกรอบแต่ตัดขอบ ใช้กับกรอบเล็กที่ไม่ต้องอ่านรายละเอียด
   */
  fit?: 'contain' | 'cover'
}

/**
 * งานศิลป์ของกิจกรรมหนึ่งใบ
 * มีรูปปกจริงก็เต็มกรอบ ถ้ายังไม่มีก็เป็นไอคอนจาก sprite sheet เหมือนเดิม
 */
export default function ActivityArt({
  space,
  iconClassName = 'w-[54%]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  fit = 'contain',
}: ActivityArtProps) {
  if (space.cover) {
    return (
      <Image
        src={space.cover.src}
        alt={space.cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        // ปรับแค่ตอนแสดงผล ไฟล์ต้นฉบับไม่ถูกแตะ
        className={`object-center ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
      />
    )
  }

  return (
    <span className={`block overflow-hidden rounded-[10px] ${iconClassName}`}>
      <SpaceIcon position={space.iconPosition} title={space.title} />
    </span>
  )
}
