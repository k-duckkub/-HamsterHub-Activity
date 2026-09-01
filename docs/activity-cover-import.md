# รูปปกจริงของกิจกรรม

หน้าเว็บใช้ไอคอนจาก sprite sheet เป็นงานศิลป์ชั่วคราว กิจกรรมไหนมีไฟล์ปกจริงแล้ว
ระบบจะสลับไปใช้รูปนั้นแทนทันที ทั้งหน้ารายละเอียด แถบ "กิจกรรมอื่นที่น่าสนใจ" และการ์ดในหน้า Explore

## วิธีใส่

1. วางไฟล์ไว้ที่ `public/assets/activities/` โดยตั้งชื่อตาม slug ของกิจกรรม
   นามสกุลที่รับ: `.png` `.jpg` `.jpeg` `.webp`
2. รัน `npm run covers`
   สคริปต์จะอ่านขนาดจริงของแต่ละไฟล์แล้วเขียน `data/activity-covers.generated.ts`
   (ไฟล์ที่ชื่อไม่ตรงกับ slug ไหนเลยจะถูกข้ามพร้อมคำเตือน)
3. `npm run build`

ไม่มีไฟล์ = ไม่มีรูป กิจกรรมนั้นจะกลับไปใช้ไอคอนเหมือนเดิม ไม่มีการใส่ภาพแทนให้

## slug ทั้งหมด

| slug | ชื่อกิจกรรม |
| --- | --- |
| portfolio-5-years | ค่าย เทคนิคปั้น Portfolio + ฝึกพื้นฐาน + แข่งสร้างเกม |
| ai-camp-season-2-for-dek70 | AI Camp Season 2 for Dek70+ |
| ai-for-business | AI for Business |
| dek70-camp | Dek70 Camp |
| dek70-camp-first | Dek-70 Camp |
| dek70-plus-final-round | Dek70 Plus+ |
| dek70-plus | Dek70 Plus |
| game-jam-x-5th-year | Game Jam X : 5th Year |
| game-pee-camp | Game Pee Camp |
| hamster-hub-hybrid-game-jam | Hamster Hub Hybrid Game Jam |
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
- แถบกิจกรรมอื่น: 16:9
- การ์ดในหน้า Explore และปกใหญ่: จัตุรัส

ทุกกรอบครอบภาพจากกึ่งกลาง (`object-cover`) แบนเนอร์แนวนอนยาว ๆ จึงถูกตัดข้างเมื่ออยู่ในกรอบจัตุรัส
ถ้าต้องการให้หน้า Explore ใช้กรอบแนวนอนแทน บอกได้
