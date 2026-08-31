'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import type { SortKey } from '@/data/projects'

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'latest', label: 'ล่าสุด' },
  { key: 'popular', label: 'ยอดนิยม' },
]

export const DEFAULT_SORT: SortKey = 'latest'

/** อ่านค่าจาก URL แล้วบังคับให้เป็นค่าที่รองรับเท่านั้น */
export function parseSort(value: string | null): SortKey {
  return value === 'popular' ? 'popular' : DEFAULT_SORT
}

/** แถวปุ่มเรียงลำดับเหนือกริดผลงาน — ค่าอยู่ใน URL จึงแชร์และรีเฟรชได้ */
export default function ProjectSortBar({ sort }: { sort: SortKey }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const reduced = (useReducedMotion() ?? false) === true

  const select = useCallback(
    (key: SortKey) => {
      const next = new URLSearchParams(params?.toString() ?? '')
      if (key === DEFAULT_SORT) next.delete('sort')
      else next.set('sort', key)
      const query = next.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [params, pathname, router]
  )

  return (
    <div
      role="group"
      aria-label="เรียงลำดับผลงาน"
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto overflow-y-hidden px-5 [touch-action:pan-x] sm:mx-0 sm:overflow-visible sm:px-0"
    >
      {OPTIONS.map((option) => {
        const active = option.key === sort
        return (
          <motion.button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => select(option.key)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 520, damping: 32 }}
            className={[
              'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              active
                ? 'bg-white/[0.08] text-white'
                : 'bg-white/[0.04] text-[#94A0AD] hover:bg-white/[0.08] hover:text-white',
            ].join(' ')}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
