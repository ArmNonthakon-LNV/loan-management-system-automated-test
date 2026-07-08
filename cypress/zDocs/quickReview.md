## Quick Review Checklist (QA Code Pattern)

เอกสารนี้ใช้สำหรับ **review code ของ QA** ว่าเขียนตาม pattern และ naming convention ของทีมถูกต้องหรือไม่  
อ้างอิงมาตรฐานจาก `cypress/zDocs/1-QaPattern.md` และโครงสร้างจาก `cypress/zDocs/2-FolderStructure.md`

---

### 1) Folder / File Structure

- [ ] **โครงสร้าง spec** อยู่ที่ `cypress/e2e/<category>/<apiName>/`
- [ ] **มีไฟล์มาตรฐานต่อ 1 API**:
  - [ ] `checkBizlogic.cy.js` (Business logic)
  - [ ] `checkValidateFields.cy.js` (Validate fields)
- [ ] **fixtures แยกตาม category/apiName ชัดเจน**
- [ ] **support แยกตามหน้าที่** (อยู่ใต้ `cypress/support/` เท่านั้น ไม่กระจายอยู่ใน spec)

---

### 2) Naming Convention (ไฟล์/โฟลเดอร์)

- [ ] **category**: ชื่อกลุ่มงาน/โดเมน (เช่น `billPayment`, `wallet`)
- [ ] **apiName**: ชื่อ API/feature แบบอ่านรู้เรื่องและสื่อความหมาย
- [ ] **ชื่อไฟล์ spec**: ใช้ตามมาตรฐานทีมเท่านั้น
  - [ ] `checkBizlogic.cy.js` (สะกดตามนี้)
  - [ ] `checkValidateFields.cy.js`

---

### 3) `describe` / `context` / `it` Naming

#### 3.1 `describe` (ต้องสื่อว่าเทสอะไร)
- [ ] **Biz logic**: `Check business logic of API <apiName>`
- [ ] **Validate fields**: `Check validate fields of API <apiName>`

#### 3.2 `context` (จัดกลุ่มเคสให้ชัด)
- [ ] มีการแบ่ง context ตามกลุ่มเคส เช่น
  - [ ] `Success Scenarios`
  - [ ] `Error Scenarios`
  - [ ] `Check validate field: <fieldName>`

#### 3.3 `it` (ต้องเป็นประโยคที่อ่านแล้วเข้าใจทันที)
- [ ] **Biz logic**: `Display response <success|error> when call api with <input>`
  - ตัวอย่าง: `Display response success when call api with correct data`
  - ตัวอย่าง: `Display response error when call api with appType does not exist`
- [ ] **Validate**: `Display response error when call api with <fieldName> is <condition>`
  - ตัวอย่าง: `Display response error when call api with annotation is boolean`
  - ตัวอย่าง: `Display response error when call api with empty body`

---

### 4) Variables / Data Naming

- [ ] **camelCase** สำหรับตัวแปร
- [ ] ใช้ชื่อมาตรฐาน:
  - [ ] `reqBody` (request body)
  - [ ] `expResult` (expected result)
  - [ ] `req<FieldName>` / `exp<FieldName>` (เช่น `reqAppType`, `expAppType`)
  - [ ] `reqQueryParam<KeyName>` / `expQueryParam<KeyName>`

---

### 5) Fixtures Pattern (reqBody / expResult / prepData)

- [ ] **test cases** อยู่ที่ `cypress/fixtures/<category>/<apiName>/testCases/`
  - [ ] **bizlogic**: `cypress/fixtures/<category>/<apiName>/testCases/bizlogic/bizlogic.json`
  - [ ] **validate fields**: `cypress/fixtures/<category>/<apiName>/testCases/validateFields/<fieldName>.json`
- [ ] **prep data ตาม environment** อยู่ที่ `cypress/fixtures/<category>/prepData/<env>.json`
  - [ ] ใน spec มีการ `cy.fixture('<category>/prepData/test.json')` (หรือ env ที่ถูกต้อง)

---

### 6) Support / Helper Usage

- [ ] logic ที่ใช้ซ้ำ **ต้องอยู่ใน** `cypress/support/**` แล้ว import มาใช้
- [ ] ใช้ helper เช่น `apiHelper` / `APIHelper` ให้ถูกที่
- [ ] pre-step flow อยู่ใน `cypress/support/preSteps/<category>/<apiName>.js`
- [ ] DB helper แยกตามหน้าที่:
  - [ ] `cypress/support/db/checkDb/**`
  - [ ] `cypress/support/db/getDb/**`
  - [ ] `cypress/support/db/setDb/**`

---

### 7) Security / Secrets (สำคัญ)

- [ ] **ห้าม commit credentials จริง** ลงใน repo
- [ ] ค่าที่เป็น secret ต้องไปอยู่ใน `.env` (หรือ CI secret) ไม่ใส่ใน `cypress/config/*.json`
- [ ] `.gitignore` ต้อง ignore `cypress/config/*.json` (ถ้าไฟล์นั้นมีโอกาสมีข้อมูลสำคัญ)

---

### 8) Quick Smell Checks (เจอบ่อย)

- [ ] ชื่อไฟล์/โฟลเดอร์สะกดไม่ตรงมาตรฐาน (`BizLogic` vs `Bizlogic`)
- [ ] `describe/it` ใช้ชื่อกว้างเกินไป อ่านแล้วไม่รู้เทสอะไร
- [ ] spec ไปเขียน logic ซ้ำ แทนที่จะเรียก helper
- [ ] fixtures path ไม่สอดคล้องกับโครง `category/apiName/...`
- [ ] ใส่ API key / token / password ลงใน fixtures หรือ spec โดยตรง
