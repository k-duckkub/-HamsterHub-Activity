'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { motionTokens, TOOLTIP_DELAY_MS } from '@/lib/motion'
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

const IDLE_BG = 'rgba(255,255,255,0.055)'
const HOVER_BG = 'rgba(255,255,255,0.105)'
const PRESS_BG = 'rgba(255,255,255,0.14)'

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
  const timer = useRef<number | null>(null)

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
    <span className="relative inline-flex">
      <motion.button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={() => {
          onClick?.()
          if (!flashTooltip) return
          setFlashOpen(true)
          window.setTimeout(() => setFlashOpen(false), 1400)
        }}
        onPointerEnter={openLater}
        onPointerLeave={closeNow}
        onFocus={() => setTooltipOpen(Boolean(tooltip))}
        onBlur={closeNow}
        initial={false}
        animate={{ backgroundColor: IDLE_BG }}
        whileHover={
          reduced
            ? { backgroundColor: HOVER_BG }
            : { backgroundColor: HOVER_BG, scale: 1.018, y: -1 }
        }
        whileFocus={reduced ? { backgroundColor: HOVER_BG } : { backgroundColor: HOVER_BG }}
        whileTap={
          reduced
            ? { backgroundColor: PRESS_BG }
            : { backgroundColor: PRESS_BG, scale: 0.965, y: 1 }
        }
        transition={reduced ? motionTokens.hover : motionTokens.softSpring}
        className={[
          'flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium',
          'border border-white/[0.025]',
          active ? 'text-primary' : 'text-white',
          className,
        ].join(' ')}
      >
        {children}
      </motion.button>

      <Tooltip
        label={flashOpen && flashTooltip ? flashTooltip : (tooltip ?? label)}
        open={flashOpen || tooltipOpen}
        reduced={reduced}
      />
    </span>
  )
}
