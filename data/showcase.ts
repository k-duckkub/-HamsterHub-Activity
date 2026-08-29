export type ShowcaseSlot = {
  slotIndex: number
  project: null
}

/** ช่องว่างพร้อมรับผลงานจริงภายหลัง โดยไม่ต้องเปลี่ยนโครง UI */
export const SHOWCASE_SLOTS: ShowcaseSlot[] = Array.from(
  { length: 5 },
  (_, slotIndex) => ({ slotIndex, project: null }),
)
