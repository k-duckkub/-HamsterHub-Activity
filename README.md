# HamsterHub — หน้า Explore

หน้า “สำรวจ” ของ HamsterHub: เลือกพื้นที่ด้วย Horizontal Center-Snap Carousel
เมื่อการ์ดเลื่อนมาอยู่ตรงกลาง พื้นหลัง Hero ชื่อ หมวดหมู่ คำอธิบาย จำนวนผู้รับชม
และ CTA จะเปลี่ยนตามแบบ crossfade ต่อเนื่อง

## Stack

- React 18 + Vite
- Tailwind CSS (โทเคนสีของแบรนด์อยู่ใน `tailwind.config.js`)
- Framer Motion (spring `stiffness 280 / damping 24 / mass 0.75`)

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

## โครงสร้าง

- `src/App.jsx` — จัดวาง Sidebar + Hero + Carousel และถือ state ของการ์ดที่ active
- `src/components/Sidebar.jsx` — เมนู 5 รายการ, “สำรวจ” เป็น active pill
- `src/components/Hero.jsx` — พื้นหลังไดนามิก + ข้อความ (AnimatePresence crossfade)
- `src/components/Carousel.jsx` — drag / swipe / wheel / ปุ่มลูกศร / คีย์บอร์ด + spring snap
- `src/components/TactileButton.jsx` — ปุ่มสัมผัสนุ่มแบบซิลิโคน
- `src/data/spaces.jsx` — ข้อมูลพื้นที่ ไอคอน 3D และฉากพื้นหลัง (SVG ล้วน ไม่มีไฟล์ภาพภายนอก)

## การเข้าถึง

รองรับ `prefers-reduced-motion` (เปลี่ยนเป็น fade สั้น ๆ), โฟกัสด้วยคีย์บอร์ดได้ทุกปุ่ม,
มี visible focus ring, `aria-label` บนปุ่มลูกศรและ carousel และไม่มี autoplay
