# Explore — โครงสร้างส่วนที่ 3 / 4 / 5

หน้าเดียว `app/explore/page.tsx` → `components/explore/ExploreCoverPage.tsx`
ลำดับ section: (1) Cover picker → (2) ProjectGrid → **(3) ShortsReveal → (4) ActivityShowcase → (5) SubscribeFooter**

## กติกาที่ห้ามละเมิด
- พื้นหลัง `#0D1117`, เส้นคั่น `#27313B`, accent เดียวคือ `primary #FF6B00`
- ห้ามเพิ่มฟอนต์ใหม่ — ใช้ `var(--font-ui)` จาก `app/layout.tsx` เท่านั้น
- radius การ์ด `18px` (ปกใหญ่ `28px`), เงาชุดเดิมจาก `ProjectCard.tsx`
- ทุก motion อ่านค่าจาก `lib/motion.ts` + เคารพ `useReducedMotion()`
- โทน Netflix: การ์ดคือพระเอก ข้อความน้อย พื้นหลังมืดสนิท

## Section 3 — ShortsReveal (สล็อตสุ่มเปิดผลงาน)
ไฟล์ใหม่: `components/explore/ShortsReveal.tsx`, `components/explore/ShortSlot.tsx`
- แถวการ์ดแนวตั้ง 9:16 จำนวน 5 ใบ (แนวเดียวกับ YouTube Shorts) เลื่อนแนวนอนบนจอเล็ก
- สถานะต่อใบ: `idle` (เครื่องหมาย `?`) → `spinning` → `revealed`
- คลิก 1 ใบ = หมุนเฉพาะใบนั้น ระยะ 1.1–1.6s (สุ่มต่อ index เล็กน้อยให้ไม่พร้อมกัน)
- ระหว่างหมุน: สลับภาพ decoy จาก `data/projects.ts` ทุก ~90ms (ภาพจริงถูกล็อกไว้แล้วต่อ slot)
- ผลลัพธ์ **deterministic** — กำหนดใน `data/shorts.ts` (`SHORT_SLOTS: {slotIndex, projectId}[]`) ไม่สุ่มจริง
- จบด้วย pop + ring เรืองสีของผลงาน; hover ยก `-4px` scale `1.012` เหมือน `ProjectCard`
- a11y: `<button>` ต่อใบ, `aria-label="เปิดผลงานช่องที่ n"`, `aria-live` ประกาศชื่อผลงานที่ได้, reduced-motion = ข้ามการหมุน เผยผลทันที

## Section 4 — ActivityShowcase (ผลงานเด็ก แบบ placeholder)
ไฟล์ใหม่: `components/explore/ActivityShowcase.tsx`
- หัวข้อสั้น + คำโปรย 1 บรรทัด (โทนโปรโมต activity ของ HamsterHub)
- กริด 16:9 ขนาดเดียวกับ `ProjectGrid` (`md:2 / xl:3`, gap `16px / 34px`)
- การ์ดยัง **ว่าง**: พื้น gradient เข้มอ่อน + skeleton shimmer + แถบ meta สีจาง (ไม่มีข้อความจริง)
- ใบสุดท้ายเป็นช่อง `+ เพิ่มผลงาน` (dashed `#33404E`) — ตอนนี้เป็น visual เท่านั้น ยังไม่ต่อ upload
- ข้อมูลมาจาก `data/showcase.ts` (array ว่าง n ช่อง) เพื่อสลับเป็นผลงานจริงภายหลังโดยไม่แก้ UI

## Section 5 — SubscribeFooter (พื้นหลังเลื่อน + CTA)
ไฟล์ใหม่: `components/explore/SubscribeFooter.tsx`
- พื้นหลัง 6 คอลัมน์แนวตั้ง เลื่อนสลับขึ้น/ลง วนไม่รู้จบ (duplicate list แล้ว `translateY(-50%)`)
- CSS animation ล้วน (ไม่ใช้ framer-motion) + `veil` radial ทับให้ข้อความอ่านออก, opacity พื้นหลัง ~0.22
- กลางจอ: `Thanks for watching` + คำโปรย + ปุ่ม `Subscribe Now` สี `primary` ทรง pill
- reduced-motion = หยุด animation ค้างเฟรมเดียว

## ลำดับงานสำหรับ agent
1. `data/shorts.ts`, `data/showcase.ts`
2. `ShortSlot.tsx` → `ShortsReveal.tsx`
3. `ActivityShowcase.tsx`
4. `SubscribeFooter.tsx`
5. ต่อทั้งสามเข้า `ExploreCoverPage.tsx` ใต้ `<ProjectGrid />`
6. ตรวจ: build ผ่าน, reduced-motion, จอ 375 / 768 / 1440
