/** รูปปกจริงของกิจกรรม มีเฉพาะกิจกรรมที่ได้ไฟล์มาแล้ว */
export type ActivityCover = {
  src: string
  width: number
  height: number
  alt: string
}

/** ฟิลด์กิจกรรมจริงตามที่มีใน CSV ของ CampHub — ไม่มีช่องไหนที่แต่งขึ้นเอง */
export type RealActivity = {
  slug: string
  title: string
  /** คำโปรยสั้น ใช้ทั้งหน้ารายละเอียดและ meta description */
  summary: string
  categories: string[]
  dateStart: string
  dateEnd: string
  /** เช่น "ศุกร์-อาทิตย์" หรือ "19:00-21:00" */
  scheduleNote: string
  applyDeadline: string
  capacity: string
  fee: string
  eligibility: string
  extraRequirement: string
  applyUrl: string
  /** คำอธิบายเต็ม เก็บทีละบรรทัดเพื่อคงรูปแบบเดิมไว้ */
  description: string[]
}
