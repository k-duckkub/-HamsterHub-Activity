# Explore — โครงสร้างส่วนที่ 3 / 4 / 5

หน้าเดียว `app/explore/page.tsx` → `components/explore/ExploreCoverPage.tsx`
ลำดับ section: (1) Cover picker → (2) ProjectGrid → **(3) ShortsReveal → (4) ActivityShowcase → (5) SubscribeFooter**

## กติกาที่ห้ามละเมิด
- พื้นหลัง `#0D1117`, เส้นคั่น `#27313B`, accent เดียวคือ `primary #FF6B00`
- ห้ามเพิ่มฟอนต์ใหม่ — ใช้ `var(--font-ui)` จาก `app/layout.tsx` เท่านั้น
- radius การ์ด `18px` (ปกใหญ่ `28px`), เงาชุดเดิมจาก `ProjectCard.tsx`
- ทุก motion อ่านค่าจาก `lib/motion.ts` + เคารพ `useReducedMotion()`
- โทน Netflix: การ์ดคือพระเอก ข้อความน้อย พื้นหลังมืดสนิท

## Section 3 — ShortsReveal (การ์ดคว่ำ → หมุนสล็อต → เหรียญรางวัล)
ไฟล์ใหม่:
- `data/shorts.ts` — ผลลัพธ์ที่ล็อกไว้ต่อช่อง
- `components/explore/ShortsReveal.tsx` — แถวการ์ด + state รวม
- `components/explore/ShortSlot.tsx` — การ์ด 1 ใบ + สเตตแมชชีน
- `components/explore/CoinBurst.tsx` — เอฟเฟกต์เหรียญตอนเปิดสำเร็จ

### โครง state ต่อการ์ด
`'facedown' -> 'spinning' -> 'settling' -> 'revealed'` (เดินทางเดียว ย้อนไม่ได้)

1. **facedown** — การ์ดคว่ำ 9:16 ไม่เห็นเนื้อใน หน้าหลังเป็นลายเดียวกันทุกใบ: พื้น `#161D26`,
   เส้นขอบ `#27313B`, เครื่องหมาย `?` สี `#3A4552` กลางการ์ด, hover ยก `-4px` scale `1.012`
2. **spinning** (~1.1–1.6s สุ่มต่อ index เล็กน้อย) — สองชั้นซ้อนกัน:
   - **flip**: หมุนแกน Y ต่อเนื่อง `rotateY 0 -> 1080deg` ด้วย `preserve-3d` + `backface-visibility`
     หน้าหลัง/หน้าหน้าสลับกันตอนผ่าน 90° (เหมือนสปินการ์ด)
   - **reel**: หน้าหน้าของการ์ดสลับภาพ decoy จาก `data/projects.ts` ทุก ~90ms (เหมือนวงล้อสล็อต)
   - ความเร็วเข้า–ออกแบบ ease: เร่งช่วงแรก แล้วหน่วงช้าลงก่อนหยุด (ห้ามหยุดกึกทันที)
3. **settling** (~0.25s) — หยุดที่ผลงานจริง ค้าง overshoot เล็กน้อยแล้วเด้งกลับ (`buttonSpring`)
4. **revealed** — แสดงปกผลงานจริง + ring เรืองสี tint ของผลงาน + ยิง `CoinBurst`

### CoinBurst (อนิเมชันได้รางวัล)
- เหรียญ 12–16 เหรียญ วงกลมเล็ก gradient ทอง `#FFC24A -> #FF6B00` (อยู่ในโทน primary เดิม ห้ามใช้สีทองอื่น)
- ยิงจากกลางการ์ด กระจายออกเป็นวงพร้อมแรงโน้มถ่วง: `y` ขึ้นก่อนแล้วตกลง, `scale 0.6 -> 1 -> 0.8`,
  `rotate` สุ่ม, `opacity` จาง 0 ในช่วงท้าย รวม ~0.9s
- แฟลชขาวจาง ๆ ทับการ์ด 1 เฟรม (`opacity 0.35 -> 0` ใน 0.2s) ตอนเหรียญออก
- เหรียญเป็น `aria-hidden` ทั้งหมด และ `pointer-events-none`

### กฎเพิ่มเติม
- ผลลัพธ์ไม่สุ่มจริง — อ่านจาก `SHORT_SLOTS: { slotIndex: number; projectId: string }[]` ใน `data/shorts.ts`
  ภาพ decoy ระหว่างหมุนเท่านั้นที่สุ่ม
- กดได้ทีละใบ ใบที่ `revealed` แล้วกดซ้ำไม่ทำอะไร ใบที่กำลังหมุนกดซ้ำไม่ได้
- a11y: `<button>` ต่อใบ, `aria-label="เปิดผลงานช่องที่ n"`, `aria-live="polite"` ประกาศชื่อผลงานที่เปิดได้
- `useReducedMotion()` = ข้ามทั้ง flip / reel / เหรียญ → fade เข้าผลลัพธ์ใน 0.15s

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
2. `ShortSlot.tsx` → `CoinBurst.tsx` → `ShortsReveal.tsx`
3. `ActivityShowcase.tsx`
4. `SubscribeFooter.tsx`
5. ต่อทั้งสามเข้า `ExploreCoverPage.tsx` ใต้ `<ProjectGrid />`
6. ตรวจ: build ผ่าน, reduced-motion, จอ 375 / 768 / 1440
