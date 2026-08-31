'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Toast = { id: number; message: string }

type ToastApi = { show: (message: string) => void }

const ToastContext = createContext<ToastApi | null>(null)

const VISIBLE_MS = 2400

/** แจ้งผลสั้น ๆ ท้ายจอ ใช้แทน alert() ทั้งเว็บ */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const reduced = (useReducedMotion() ?? false) === true

  const show = useCallback((message: string) => {
    const id = nextId.current++
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      VISIBLE_MS
    )
  }, [])

  const api = useMemo<ToastApi>(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* วางเหนือแถบล่างของมือถือ เพื่อไม่บังการนำทาง */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[900] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reduced ? 0.15 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full border border-white/10 bg-[#1C242E] px-4 py-2.5 text-[14px] font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  // นอก provider ก็ยังเรียกได้ เพียงแต่ไม่มีอะไรขึ้น
  return context ?? { show: () => undefined }
}
