'use client'

import { forwardRef } from 'react'

type TransparentVideoProps = {
  src: string
  className?: string
  loop?: boolean
}

/**
 * เลเยอร์เอฟเฟกต์พื้นหลังโปร่ง — WebM เล่นเป็นวิดีโอ ส่วน PNG วางเป็นภาพนิ่ง
 * ทั้งสองแบบใช้ object-contain เพื่อรักษาสัดส่วนและ alpha ของไฟล์ต้นทาง
 */
const TransparentVideo = forwardRef<HTMLDivElement, TransparentVideoProps>(
  function TransparentVideo({ src, className = '', loop = false }, ref) {
    const isVideo = src.endsWith('.webm')

    return (
      <div ref={ref} className={className}>
        {isVideo ? (
          <video
            className="h-full w-full object-contain"
            src={src}
            muted
            playsInline
            preload="auto"
            loop={loop}
            aria-hidden="true"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-full w-full object-contain"
            src={src}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        )}
      </div>
    )
  }
)

export default TransparentVideo
