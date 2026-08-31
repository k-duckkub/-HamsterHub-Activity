'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { COMING_SOON, NAV_ITEMS, SHOWCASE_ITEM } from '@/lib/navigation'

const EASE = [0.22, 1, 0.36, 1] as const
const DURATION = 0.28

/** เมนูมือถือแบบแผ่นเลื่อนจากขวา — ปิดด้วยปุ่ม X, แตะฉากหลัง, Escape หรือเลือกเมนู */
export default function MobileMenu({
  open,
  onClose,
  returnFocusTo,
}: {
  open: boolean
  onClose: () => void
  returnFocusTo: React.RefObject<HTMLElement>
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = (useReducedMotion() ?? false) === true
  // แถบบนใช้ backdrop-filter ซึ่งทำให้ position: fixed ข้างในยึดกับแถบแทนที่จะยึดกับจอ
  // เมนูจึงต้องไปอยู่ที่ body ผ่าน portal
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => {
    onClose()
    // คืนโฟกัสให้ปุ่มที่เปิดเมนู เพื่อไม่ให้คนใช้คีย์บอร์ดหลงที่
    window.requestAnimationFrame(() => returnFocusTo.current?.focus())
  }, [onClose, returnFocusTo])

  // ล็อกการเลื่อนหน้า และชดเชยความกว้างของแถบเลื่อนไม่ให้เนื้อหากระโดด
  useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const overflow = body.style.overflow
    const padding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = overflow
      body.style.paddingRight = padding
    }
  }, [open])

  // Escape ปิด และ Tab วนอยู่ในแผ่นเมนู
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()
    )
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, open])

  const items = [...NAV_ITEMS, SHOWCASE_ITEM]

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.button
            type="button"
            aria-label="ปิดเมนู"
            onClick={close}
            className="absolute inset-0 h-full w-full bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : DURATION, ease: EASE }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="เมนูหลัก"
            className="absolute inset-y-0 right-0 flex w-[82%] max-w-[340px] flex-col border-l border-[#27313B] bg-[#0D1117] px-5 pb-8 pt-4"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduced ? 0.12 : DURATION, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-extrabold tracking-[0.14em] text-white">
                HAMSTER <span className="text-primary">HUB</span>
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="ปิดเมนู"
                className="grid h-9 w-9 place-items-center rounded-full text-[#94A0AD] transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1">
              {items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className={[
                      'flex items-center justify-between rounded-[12px] px-3 py-3 text-[16px] font-medium transition-colors duration-150',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
                      item.emphasis
                        ? 'mt-3 bg-primary font-bold text-white hover:brightness-110'
                        : 'text-white hover:bg-white/[0.08]',
                    ].join(' ')}
                  >
                    {item.label}
                    {item.emphasis && <ArrowUpRight size={16} aria-hidden="true" />}
                  </Link>
                ) : (
                  // หน้าที่ยังไม่มีจริง แสดงไว้แต่กดไม่ได้ ไม่พาไปหน้าอื่นแบบเงียบ ๆ
                  <span
                    key={item.label}
                    aria-disabled="true"
                    className="flex items-center justify-between rounded-[12px] px-3 py-3 text-[16px] font-medium text-[#687482]"
                  >
                    {item.label}
                    <span className="text-[12px] font-normal">{COMING_SOON}</span>
                  </span>
                )
              )}
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
