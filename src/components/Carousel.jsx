import React from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
} from 'framer-motion'
import { SOFT_SPRING, REDUCED } from './motion'

const CARD_W = 168
const GAP = 22
const STEP = CARD_W + GAP

function SpaceCard({ space, index, x, isActive, onSelect, reduced, tilt }) {
  // ระยะห่างของการ์ดจากจุดกึ่งกลางจอ (px)
  const offset = useTransform(x, (v) => v + index * STEP)
  const scale = useTransform(offset, [-2 * STEP, 0, 2 * STEP], [0.88, 1, 0.88], {
    clamp: true,
  })
  const opacity = useTransform(
    offset,
    [-2.4 * STEP, 0, 2.4 * STEP],
    [0.72, 1, 0.72],
    { clamp: true }
  )

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isActive}
      aria-label={space.name}
      tabIndex={-1}
      onClick={() => onSelect(index)}
      style={{
        width: CARD_W,
        scale: reduced ? 1 : scale,
        opacity: reduced ? 1 : opacity,
      }}
      animate={{
        y: isActive ? -6 : 0,
        rotate: reduced ? 0 : tilt,
        boxShadow: isActive
          ? '0 2px 4px rgba(10, 26, 47, 0.06), 0 14px 36px rgba(10, 26, 47, 0.14)'
          : '0 1px 2px rgba(10, 26, 47, 0.05), 0 8px 24px rgba(10, 26, 47, 0.08)',
      }}
      whileHover={reduced || isActive ? {} : { y: -4, scale: 1.015 }}
      whileTap={reduced ? {} : { scale: 0.975 }}
      transition={reduced ? REDUCED : SOFT_SPRING}
      className="relative shrink-0 select-none rounded-card bg-[#FFFDFB] p-4 text-center"
    >
      {/* กรอบส้มของการ์ด active — ค่อย ๆ ปรากฏ ไม่ตัดเปลี่ยนทันที */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-card"
        style={{ border: '1.5px solid #FF6B00' }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={reduced ? REDUCED : { duration: 0.35, ease: 'easeOut' }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-card"
        style={{ border: '1px solid #D9D9D9' }}
      />
      <span className="mx-auto block h-[86px] w-[86px] [transform:translateZ(0)]">
        {space.icon}
      </span>
      <span
        className={[
          'mt-3 block text-[15px] font-semibold tracking-tight',
          isActive ? 'text-ink' : 'text-body',
        ].join(' ')}
      >
        {space.name}
      </span>
    </motion.button>
  )
}

function ArrowButton({ dir, onClick, disabled, reduced }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'พื้นที่ก่อนหน้า' : 'พื้นที่ถัดไป'}
      whileHover={reduced || disabled ? {} : { scale: 1.05, y: -1 }}
      whileTap={reduced || disabled ? {} : { scaleX: 0.95, scaleY: 0.9, y: 2 }}
      transition={reduced ? REDUCED : SOFT_SPRING}
      className="hidden h-11 w-11 shrink-0 place-items-center sm:grid rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-primary hover:text-primary disabled:opacity-30 focus-ring-light"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'prev' ? <path d="M14.5 5 8 12l6.5 7" /> : <path d="M9.5 5 16 12l-6.5 7" />}
      </svg>
    </motion.button>
  )
}

export default function Carousel({ spaces, activeIndex, onChange }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(-activeIndex * STEP)
  const [tilt, setTilt] = React.useState(0)
  const wheelLock = React.useRef(0)

  // เลื่อนแบบ spring ไปยังการ์ดที่ถูกเลือก
  React.useEffect(() => {
    const controls = animate(x, -activeIndex * STEP, reduced ? REDUCED : SOFT_SPRING)
    return () => controls.stop()
  }, [activeIndex, reduced, x])

  const clamp = React.useCallback(
    (i) => Math.max(0, Math.min(spaces.length - 1, i)),
    [spaces.length]
  )

  const handleDragEnd = (_, info) => {
    setTilt(0)
    const projected = x.get() + info.velocity.x * 0.12
    onChange(clamp(Math.round(-projected / STEP)))
  }

  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0
    if (!delta) return
    const now = Date.now()
    if (now - wheelLock.current < 320) return
    wheelLock.current = now
    onChange(clamp(activeIndex + (delta > 0 ? 1 : -1)))
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(clamp(activeIndex + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(clamp(activeIndex - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(spaces.length - 1)
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 px-3 sm:gap-6">
      <ArrowButton
        dir="prev"
        reduced={reduced}
        disabled={activeIndex === 0}
        onClick={() => onChange(clamp(activeIndex - 1))}
      />

      <div
        role="listbox"
        aria-label="เลือกพื้นที่"
        aria-orientation="horizontal"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        style={{
          // ให้การ์ดริมซ้าย–ขวาค่อย ๆ จางหายแทนการถูกตัดเป็นเส้นตรง
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)',
        }}
        className="relative w-full max-w-[760px] overflow-hidden py-6"
      >

        <motion.div
          className="flex cursor-grab items-center active:cursor-grabbing"
          style={{ x, gap: GAP, paddingLeft: `calc(50% - ${CARD_W / 2}px)`, paddingRight: `calc(50% - ${CARD_W / 2}px)` }}
          drag="x"
          dragElastic={0.14}
          dragMomentum={false}
          dragConstraints={{
            left: -(spaces.length - 1) * STEP - STEP * 0.35,
            right: STEP * 0.35,
          }}
          onDrag={(_, info) => {
            if (reduced) return
            const next = Math.max(-6, Math.min(6, info.velocity.x * 0.003))
            setTilt(next)
          }}
          onDragEnd={handleDragEnd}
        >
          {spaces.map((space, i) => (
            <SpaceCard
              key={space.id}
              space={space}
              index={i}
              x={x}
              reduced={reduced}
              tilt={i === activeIndex ? tilt : 0}
              isActive={i === activeIndex}
              onSelect={onChange}
            />
          ))}
        </motion.div>
      </div>

      <ArrowButton
        dir="next"
        reduced={reduced}
        disabled={activeIndex === spaces.length - 1}
        onClick={() => onChange(clamp(activeIndex + 1))}
      />
    </div>
  )
}
