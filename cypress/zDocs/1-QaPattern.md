## Pattern การเขียน Test Code ของทีม

### 0. Folder Structure (ภาพรวม)

- **โครงสร้างเต็มของโปรเจกต์**: ดูที่ `zDocs/2-FolderStructure.md`  
  - อธิบาย root (`cypress.config.js`, `cypress/`, `zDocs/`) และการแบ่งโฟลเดอร์ย่อยทั้งหมด
  - ระบุโครงสร้างของ `e2e/`, `fixtures/`, `support/`, `reports/`, `results/` ตามที่ใช้จริงในโปรเจกต์นี้
- **สำหรับการออกแบบเทสใหม่**:
  - ใช้ tree ตัวอย่างใน `2-FolderStructure.md` เป็น reference หลัก
  - ตั้งชื่อ `<category>/<apiName>` และวางไฟล์ตาม flow เดียวกันทุก API (ทั้งฝั่ง spec และ fixtures)

### 1. Testing Framework & Commands
- **Framework**: ใช้ Cypress สำหรับ E2E และ API testing
- **Run Test**: `npx cypress open --env configFile=test`
- **Run Specific Test**: `npx cypress run --env configFile=test --spec "cypress/e2e/apiName/checkBizLogic.cy.js"`
- **Generate Report**: `npx mochawesome-merge cypress/reports/*.json > cypress/reports/report.json && npx mochawesome-report-generator cypress/reports/report.json --reportDir cypress/reports --reportFilename apiGetBookList.html`

### 2. โครงสร้าง Test Scripts

- **Pattern โฟลเดอร์**: `cypress/e2e/<category>/<apiName>/`
  - ตัวอย่าง: `cypress/e2e/billPayment/apiInitiation/`
- **ไฟล์มาตรฐานต่อ 1 API/feature**:
  - `checkBizLogic.cy.js` – ทดสอบ business logic
  - `checkValidateFields.cy.js` – ทดสอบ validation ของแต่ละ field

### 3. Naming Conventions

#### Variables (Camel Case):
- `reqBody` - request body
- `expResult` - expected result
- `req<FieldName>` - request field (เช่น `reqAppType`)
- `exp<FieldName>` - expected field (เช่น `expAppType`)
- `reqQueryParam<KeyName>` - query parameter (เช่น `reqQueryParamAppType`)
- `expQueryParam<KeyName>` - expected query param (เช่น `expQueryParamAppType`)

#### Describe Blocks:
- **API Biz Logic**: `Check business logic of API <apiName>`
- **API Validate**: `Check validate fields of API <apiName>`
- **UI Biz Logic**: `Check business logic of feature <featureName>`
- **UI Validate**: `Check validate fields of feature <featureName>`

#### Test Case Names: 
- **Biz Logic**: `Display response <success/error> when call api with <input>`  และต้องอธิบายได้ว่า test อะไรให้เข้าใจง่าย
  - ตัวอย่าง: `Display response success when call api with correct data`
  - ตัวอย่าง: `Display response error when call api with appType does not exist`
- **Validate**: `Display response error when call api with <fieldName> is <condition>`
  - ตัวอย่าง: `Display response error when call api with endpoint is invalid`
  - ตัวอย่าง: `Display response error when call api with empty body`

### 4. Fixtures Structure

รายละเอียดโครงสร้างไฟล์ fixtures (reqBody / expResult / prepData) ให้ดูที่  
`zDocs/2-FolderStructure.md` หัวข้อ **3. Fixtures (Test Data)** ซึ่งสรุป tree จริงของโปรเจกต์ไว้แล้ว

หลักการที่ต้องยึด:

- แยก `reqBody` กับ `expResult` ชัดเจน
- แยก `bizLogic` กับ `validateFields` เป็นคนละโฟลเดอร์ย่อย
- แยก test data ตาม environment (เช่น `billPayment/dev|test|stg/prepData.json`) เมื่อจำเป็น

### 5. Support Files Structure

โครงสร้างเต็มของ `cypress/support` ดูได้ที่  
`zDocs/2-FolderStructure.md` หัวข้อ **4. Support (Reusable Helpers)**

หลักการที่ต้องยึด:

- ทุก helper/shared logic ให้เก็บไว้ใต้ `cypress/support` ไม่เขียนซ้ำใน spec
- แยกตามหน้าที่: `checkDB/`, `setDB/`, `getDB/`, `preStep/`, และ helper อื่น ๆ ตาม domain
- ใช้ pattern การตั้งชื่อ class/file ตามที่ระบุในหัวข้อ **Class Naming Conventions** ด้านล่าง

### 6. Class Naming Conventions

- **API / Domain Classes (PascalCase, เป็นคำนาม)**:
  - ตัวอย่าง: `FavoriteList`, `WalletInfo`, `VerifyOtpLogin`
- **Database Check Classes** (แยกตาม schema):
  - **Folder**: `cypress/support/checkDB/<dbName>/`
  - **File**: `tb<TableName>.js`
  - **Class**: `Check<DbNamePascalCase>Tb<TableNamePascalCase>`
    - ตัวอย่าง: `CheckAdapterBayBillPaymentTbBillPaymentTransactionOrders`
  - **Instance Export**: `onCheck<DbNamePascalCase>Tb<TableNamePascalCase>`
    - ตัวอย่าง: `onCheckAdapterBayBillPaymentTbBillPaymentTransactionOrders`
- **Database Set Classes**:
  - **Pattern**: `Set<dbName>Tb<table>`
  - ตัวอย่าง: `SetDPAgentTbUserActiveInfo`, `SetiBahtTbCard`

### 7. Git Commit Message Format

- `[เลขการ์ด] Script for API <apiName>`
- `[เลขการ์ด] Update script for API <apiName>`
- `Refactor code API <apiName>`
- `Add new method: <methodName>`
- `Rename file <fileName>`
- `Rename Folder <folderName>`
- `Delete file <fileName>`
- `Delete Folder <folderName>`
- `Draft API <apiName>`

---

## สรุปหลักการสำคัญ

1. **แยกไฟล์ตามประเภท**: Business Logic vs Validation
2. **Naming Convention**: ใช้ Camel Case สำหรับตัวแปร, PascalCase สำหรับ Class
3. **Fixtures Organization**: แยก reqBody และ expResult อย่างชัดเจน
4. **Support Files**: แยกตามหน้าที่ (methodHelper, checkDB, setDB, getDB, preStep)
5. **Class Design**: Class names เป็น Noun และใช้ PascalCase
6. **Test Case Clarity**: Test case names อ่านเข้าใจได้ชัดเจน
7. **Multi-Environment**: รองรับหลาย environment (dev, test, stg)
