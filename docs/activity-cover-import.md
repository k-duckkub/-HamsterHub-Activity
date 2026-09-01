# รูปปกจริงของกิจกรรม

หน้าเว็บใช้ไอคอนจาก sprite sheet เป็นงานศิลป์ชั่วคราว กิจกรรมไหนมีไฟล์ปกจริงแล้ว
ระบบจะสลับไปใช้รูปนั้นแทนทันที ทั้งหน้ารายละเอียด แถบ "กิจกรรมอื่นที่น่าสนใจ" และการ์ดในหน้า Explore

## วิธีใส่

1. วางไฟล์ไว้ที่ `public/assets/activity-covers/` (วางในโฟลเดอร์ย่อยเช่น `additional/` ได้)
   นามสกุลที่รับ: `.png` `.jpg` `.jpeg` `.webp`
2. จับคู่ไฟล์กับ slug ที่ `COVER_MAP` ใน `scripts/import-covers.mjs`
   (ชื่อไฟล์ไม่จำเป็นต้องตรงกับ slug จึงต้องระบุคู่ไว้ที่เดียวตรงนี้)
3. รัน `npm run covers`
   สคริปต์จะอ่านขนาดจริงของแต่ละไฟล์แล้วเขียน `data/activity-covers.generated.ts`
   พร้อมรายงานไฟล์ที่ยังจับคู่ไม่ได้
4. `npm run build`

ไม่มีไฟล์ = ไม่มีรูป กิจกรรมนั้นจะกลับไปใช้ไอคอนเหมือนเดิม ไม่มีการใส่ภาพแทนให้

## slug ทั้งหมด (15 กิจกรรมที่อยู่บนเว็บ)

| slug | ชื่อกิจกรรม |
| --- | --- |
| ai-camp-season-2-for-dek70 | AI Camp Season 2 for Dek70+ |
| ai-for-business | AI for Business |
| dek70-camp | Dek70 Camp |
| dek70-camp-first | Dek-70 Camp |
| game-jam-x-5th-year | Game Jam X : 5th Year |
| game-pee-camp | Game Pee Camp |
| intelligence-camp-ep-2 | Intelligence Camp EP-2 |
| intelligence-camp | Intelligence Camp |
| kid-day | Kid Day |
| nsc-software-project-2026 | NSC Software Project 2026 |
| python-adventure-camp | Python Adventure Camp |
| python-x-hunter-camp | Python x Hunter Camp |
| scigame-lab-camp | SciGame Lab Camp |
| starlight | StarLight |
| tech-booster-for-teens | Tech Booster for Teens |

## สัดส่วนภาพ

- หน้ารายละเอียด: กรอบ 16:5 (จอเล็ก 16:7)
- แถบกิจกรรมอื่น และปกใบใหญ่ในหน้า Explore: 16:9
- การ์ดเล็กแถวล่างของหน้า Explore: 16:9

ที่ที่ต้องอ่านตัวหนังสือบนโปสเตอร์ใช้ `object-contain` จึงเห็นทั้งใบ ไม่มีการตัดขอบ
เหลือแต่การ์ดเล็กแถวล่างที่ใช้ `object-cover` เพราะเป็นแค่ตัวเลือก ไม่ได้ให้อ่านรายละเอียด
ไฟล์ต้นฉบับไม่ถูกครอปหรือแก้ไขใด ๆ

## ไฟล์ที่ยังจับคู่ไม่ได้

ทุกไฟล์ commit ไว้ในโฟลเดอร์แล้ว รอแค่บอกว่าเป็นของกิจกรรมไหนถึงจะเติมลง `COVER_MAP` ได้

| ไฟล์ | ข้อความบนภาพ | ทำไมยังไม่จับคู่ |
| --- | --- | --- |
| `additional/dek70DT.png` | DEK70 Camp SEASON 2 | เป็นภาพเดียวกับ `dek70-camp-season-2.jpg` (2048×1151 เหมือนกัน) ที่ใช้อยู่แล้ว จึงเก็บไว้เป็นไฟล์สำรอง |
| `additional/HGJSP.png` | HAMSTER HUB GAME JAM SP · 48 ชั่วโมง | ไม่มีกิจกรรมที่ตรง — Hybrid Game Jam (72 ชั่วโมง) ถูกเอาออกจากเว็บแล้วเพราะยังไม่มีโปสเตอร์ |

## กิจกรรมที่เอาออกจากเว็บชั่วคราว

CSV ยังอยู่ใน `data/source/activities/` และรายชื่อไฟล์ที่ข้ามอยู่ใน `EXCLUDED`
ของ `scripts/import-activities.mjs` — เอากลับขึ้นเว็บได้ทันทีที่มีโปสเตอร์จริง

| กิจกรรม | ไฟล์ต้นทาง | เหตุผล |
| --- | --- | --- |
| Dek70 Plus | `Dek70_Plus_Camp.csv` | เจ้าของข้อมูลสั่งให้เหลือ Dek70 แค่ค่าย 1 กับ 2 |
| Dek70 Plus+ | `Dek70_Final_Round.csv` | เหตุผลเดียวกัน |
| ค่าย เทคนิคปั้น Portfolio + ฝึกพื้นฐาน + แข่งสร้างเกม | `5_Years.csv` | ยังไม่มีโปสเตอร์จริง |
| Hamster Hub Hybrid Game Jam | `Hybrid_Game_Jam.csv` | ยังไม่มีโปสเตอร์จริง |
