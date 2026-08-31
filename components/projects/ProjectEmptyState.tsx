'use client'

import { FolderOpen } from 'lucide-react'

/** ใช้ได้ทั้งกรณีกิจกรรมยังไม่มีผลงาน และกรณีกรองแล้วไม่เจอ */
export default function ProjectEmptyState({
  title = 'ยังไม่มีผลงานในหมวดนี้',
  description = 'ลองเลือกหมวดอื่น หรือกลับมาดูใหม่อีกครั้ง',
  onClear,
}: {
  title?: string
  description?: string
  onClear?: () => void
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-[20px] border border-white/[0.08] px-6 py-16 text-center">
      <FolderOpen size={32} className="text-[#687482]" aria-hidden="true" />
      <p className="mt-4 text-[17px] font-semibold text-white">{title}</p>
      <p className="mt-1.5 max-w-[36ch] text-[14px] text-[#94A0AD]">{description}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-full bg-white/[0.08] px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ล้างตัวกรอง
        </button>
      )}
    </div>
  )
}
