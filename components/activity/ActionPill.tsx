'use client'

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { TOOLTIP_DELAY_MS } from '@/lib/motion'
import { useRipple } from '@/components/ui/RippleSurface'
import Tooltip from './Tooltip'

type ActionPillProps = {
  label: string
  tooltip?: string
  /** ป้ายที่อยากให้ขึ้นทันทีหลังกด เช่น "บันทึกแล้ว" */
  flashTooltip?: string
  active?: boolean
  reduced: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

/**
 * ปุ่มแคปซูลแบบ YouTube: พื้นหลังสว่างขึ้นตอนชี้ เข้มขึ้นตอนกด และมีหมึกแผ่จากจุดที่กด
 * ตัวปุ่มไม่ขยับและไม่ย่อ ทุกอย่างจบที่สีพื้นกับหมึก
 */
export default function ActionPill({
  label,
  tooltip,
  flashTooltip,
  active = false,
  reduced,
  onClick,
  children,
  className = '',
}: ActionPillProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [flashOpen, setFlashOpen] = useState(false)
  const [pressed, setPressed] = useState(false)
  const timer = useRef<number | null>(null)
  const { spawn, surface } = useRipple(reduced)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    []
  )

  const openLater = () => {
    if (!tooltip) return
    timer.current = window.setTimeout(() => setTooltipOpen(true), TOOLTIP_DELAY_MS)
  }

  const closeNow = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setTooltipOpen(false)
  }

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={() => {
          onClick?.()
          if (!flashTooltip) return
          setFlashOpen(true)
          window.setTimeout(() => setFlashOpen(false), 1400)
        }}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          setPressed(true)
          spawn(event)
        }}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerEnter={openLater}
        onPointerLeave={() => {
          setPressed(false)
          closeNow()
        }}
        onFocus={() => setTooltipOpen(Boolean(tooltip))}
        onBlur={closeNow}
        className={[
          'relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-2',
          'text-[14px] font-medium transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          active ? 'text-primary' : 'text-white',
          pressed ? 'bg-white/[0.14]' : 'bg-white/[0.055] hover:bg-white/[0.105]',
          className,
        ].join(' ')}
        style={{ transitionTimingFunction: 'cubic-bezier(0.05, 0, 0, 1)' }}
      >
        {children}
        {surface}
      </button>

      <Tooltip
        label={flashOpen && flashTooltip ? flashTooltip : (tooltip ?? label)}
        open={flashOpen || tooltipOpen}
        reduced={reduced}
      />
    </span>
  )
}
