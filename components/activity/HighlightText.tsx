import { Fragment, type ReactNode } from 'react'

/**
 * ทำคำสำคัญในข้อความให้เป็นสีส้ม เหมือนลิงก์กับแท็กในคำอธิบายของ YouTube
 * รับข้อความล้วนเข้ามา จึงไม่มีทางที่ HTML จากข้อมูลจะหลุดเข้าหน้า
 */
export default function HighlightText({
  text,
  terms,
}: {
  text: string
  terms: string[]
}): ReactNode {
  const wanted = terms.filter(Boolean).sort((a, b) => b.length - a.length)
  if (wanted.length === 0) return text

  const pattern = new RegExp(
    `(${wanted.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  )

  return (
    <>
      {text.split(pattern).map((part, index) =>
        wanted.includes(part) ? (
          <span key={index} className="font-medium text-primary">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  )
}
