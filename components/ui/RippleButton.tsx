'use client'

import type { ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { useRipple } from './RippleSurface'

type RippleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  reduced: boolean
  children: ReactNode
}

/** ปุ่มทรงแคปซูลแบบ YouTube: ไม่ขยับ ไม่ย่อ เปลี่ยนแค่สีพื้นกับหมึกที่แผ่จากจุดกด */
const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(function RippleButton(
  {
    reduced,
    children,
    className = '',
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    ...props
  },
  ref
) {
  const { spawn, surface } = useRipple(reduced)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      ref={ref}
      type="button"
      className={[
        'relative overflow-hidden rounded-full text-[14px] font-medium transition-[background-color,filter] duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        pressed ? 'brightness-[0.94]' : '',
        className,
      ].join(' ')}
      style={{ transitionTimingFunction: 'cubic-bezier(0.05, 0, 0, 1)' }}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
        setPressed(true)
        spawn(event)
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        setPressed(false)
        onPointerUp?.(event)
      }}
      onPointerLeave={(event) => {
        setPressed(false)
        onPointerLeave?.(event)
      }}
      {...props}
    >
      {children}
      {surface}
    </button>
  )
})

export default RippleButton
