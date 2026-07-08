## Folder Structure (Cypress Framework Template)

สรุปโครงสร้างโฟลเดอร์ของโปรเจกต์ template นี้ (`folderStructure/`) สำหรับเอาไปใช้ตั้งต้นในโปรเจกต์อื่น อ้างอิงรูปแบบจาก `folderStructure.md`

---

## 1. Root Level (โครงหลักของโปรเจกต์)

```text
projectName/
├── init-cypress-framework.sh          # สร้างโครงสร้างโฟลเดอร์ cypress พื้นฐาน
├── setting-config-cypress-framework.sh# สร้างไฟล์ config / helper ตัวอย่าง
└── cypress/
    ├── cypress.config.js             # Cypress config + Node tasks (DB, report, env)
    ├── config/                       # environment configs (ไม่มี credentials จริง)
    │   ├── dev.json
    │   └── test.json
    ├── e2e/                          # spec file ตัวอย่าง
    │   └── spec.cy.js
    ├── fixtures/                     # เตรียมไว้เก็บ test data (ตอนนี้ยังว่าง)
    ├── reports/                      # ที่เก็บรายงานผลทดสอบ (mochawesome, excel)
    ├── results/                      # ที่เก็บวิดีโอรันเทสต์ (ตาม config)
    ├── support/                      # reusable helpers (API/DB/preSteps)
    │   ├── common/
    │   │   └── apiHelper.js         # helper สำหรับยิง API แบบ builder pattern
    │   ├── db/                      # แยกตามประเภทการใช้งาน DB
    │   │   ├── checkDb/             # function สำหรับตรวจสอบข้อมูล
    │   │   │   ├── deepPocket/      # (เตรียมโครงไว้)
    │   │   │   └── iBaht/
    │   │   │       └── tbCard.js    # ตัวอย่าง check table Card
    │   │   ├── getDb/               # function สำหรับดึงข้อมูล
    │   │   │   ├── deepPocket/
    │   │   │   └── iBaht/
    │   │   │       └── tbCard.js    # ตัวอย่าง get table Card
    │   │   └── setDb/               # function สำหรับแก้ไข/อัปเดตข้อมูล
    │   │       ├── deepPocket/
    │   │       └── iBaht/
    │   │           └── tbCard.js    # ตัวอย่าง set table Card
    │   └── preSteps/                # เตรียมไว้เก็บ flow pre-condition ต่าง ๆ
    ├── tools/
    │   ├── genValidateFieldsCases.js# script helper (template - ยังไม่ใส่ logic)
    │   └── recordTestEvident.js     # script สำหรับจัดการ evidence (template)
    └── zDocs/                       # เอกสารประกอบและมาตรฐานของ framework นี้
        ├── 0-JoseAiRole.md          # บทบาท AI / วิธีทำงานร่วมกับ AI
        ├── 1-QaPattern.md           # QA/Test pattern ที่ใช้กับโปรเจกต์นี้
        ├── 2-FolderStructure.md     # (ไฟล์นี้) สรุปโครงสร้างโฟลเดอร์
        └── quickReview.md           # note / quick review สั้น ๆ
```

---

## 2. จุดประสงค์ของสคริปต์ Shell

```text
init-cypress-framework.sh
```
- **หน้าที่**: สร้างโครงสร้างโฟลเดอร์และไฟล์เปล่าที่จำเป็นสำหรับ Cypress framework  
- ใช้ในโปรเจกต์ใหม่เพื่อให้ได้โครง `cypress/` เหมือน template นี้อย่างรวดเร็ว  

```text
setting-config-cypress-framework.sh
```
- **หน้าที่**: เติมเนื้อหา config / helper ตัวอย่างเข้าไปในโครงสร้างที่สร้างแล้ว เช่น  
  - `cypress/config/test.json`  
  - `cypress/e2e/spec.cy.js`  
  - `cypress/support/common/apiHelper.js`  
  - `cypress/support/db/.../tbCard.js`  
  - `.env` (template สำหรับ DB / endpoint / testedBy)  
  - `.gitignore` (รวม pattern ที่เกี่ยวกับ Cypress และความปลอดภัยของ credentials)  

---

## 3. วิธีนำไปใช้กับโปรเจกต์อื่น (ภาพรวม)

1. คัดลอกสคริปต์จาก template นี้ไปยังโปรเจกต์ใหม่  
2. รัน `init-cypress-framework.sh` เพื่อสร้างโครงสร้าง `cypress/`  
3. รัน `setting-config-cypress-framework.sh` เพื่อใส่ตัวอย่าง config และ helper  
4. แก้ไขไฟล์ต่าง ๆ ให้เข้ากับโดเมนของโปรเจกต์จริง (endpoint, DB, test cases ฯลฯ)  

รายละเอียด pattern การเขียนเทสต์และการออกแบบโฟลเดอร์ให้ดูเพิ่มเติมได้ที่ `cypress/zDocs/1-QaPattern.md` และ `folderStructure.md` ที่ root ของโปรเจกต์นี้
