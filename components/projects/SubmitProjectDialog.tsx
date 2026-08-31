'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * บอกตรง ๆ ว่าระบบส่งผลงานยังไม่เปิด
 * ไม่มีฟอร์มให้กรอก เพราะยังไม่มีที่เก็บข้อมูล — กรอกไปก็หาย
 */
export default function SubmitProjectDialog({
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

  const close = useCallback(() => {
    onClose()
    window.requestAnimationFrame(() => returnFocusTo.current?.focus())
  }, [onClose, returnFocusTo])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    window.requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('button')?.focus()
    )
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-5">
          <motion.button
            type="button"
            aria-label="ปิดหน้าต่าง"
            onClick={close}
            className="absolute inset-0 h-full w-full bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.22 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-project-title"
            className="relative w-full max-w-[420px] rounded-[18px] border border-white/10 bg-[#151B22] p-6"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: reduced ? 0.12 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="submit-project-title" className="text-[18px] font-bold text-white">
                ระบบส่งผลงานกำลังเตรียมเปิดใช้งาน
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="ปิดหน้าต่าง"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#94A0AD] transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-[14px] leading-relaxed text-[#C7CFD8]">
              ตอนนี้ยังส่งผลงานผ่านหน้านี้ไม่ได้ เพราะยังไม่มีระบบบัญชีและที่เก็บไฟล์
              เราจะเปิดให้อัปโหลดพร้อมกับระบบสมาชิก แล้วผลงานของคุณจะขึ้นในหน้ากิจกรรมทันทีที่ส่ง
            </p>

            <button
              type="button"
              onClick={close}
              className="mt-6 w-full rounded-full bg-white/[0.08] py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              เข้าใจแล้ว
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
