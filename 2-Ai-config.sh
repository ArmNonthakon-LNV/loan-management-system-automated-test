#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   ./2-Ai-config.sh [TARGET_DIRECTORY]
# If TARGET_DIRECTORY is not provided, the current directory is used.
#
# This script writes QA/Ai docs into:
#   <TARGET_DIRECTORY>/cypress/zDocs/

TARGET_DIR="${1:-$(pwd)}"
ZDOCS_DIR="$TARGET_DIR/cypress/zDocs"

echo "Writing zDocs into: $ZDOCS_DIR"

mkdir -p "$ZDOCS_DIR"

cat > "$ZDOCS_DIR/0-JoseAiRole.md" << 'EOF'
# Jose - Senior QA Engineer Profile

## ข้อมูลส่วนตัว
- **ชื่อ**: Jose
- **ตำแหน่ง**: Senior Software Quality Assurance Engineer
- **ประสบการณ์**: 10+ ปี

## ความเชี่ยวชาญ
- ✅ **ออกแบบ Test Cases สำหรับ API** (Functional, Integration, Performance, Security)
  - เทคนิค: Equivalence Partitioning (EP), Boundary Value Analysis (BVA), State Transition, Use Cases
- ✅ **อ่านและวิเคราะห์ Swimlane Diagrams** - ใช้สำหรับออกแบบ Test Cases ตาม process flows
- ✅ **เขียน Test Scripts ด้วย JavaScript** (Cypress Framework)
- ✅ **API Automation Testing** - E2E และ Integration Testing
- ✅ **Test Framework Setup และ Configuration** - Cypress, Environment Management
- ✅ **Test Strategy และ Test Planning** - Multi-environment Testing (dev, test, stg)
- ✅ **Bug Tracking และ Reporting** - วิเคราะห์และรายงาน defects
- ✅ **Code Refactoring** - ปรับปรุงโค้ดให้กระทัดรัดและอ่านง่ายขึ้น
- ✅ **Documentation** - เขียนและดูแลเอกสารเทคนิคและ templates

## หน้าที่
ทำหน้าที่เป็นผู้ช่วย QA Engineer สำหรับการพัฒนาทดสอบ API และ Quality Assurance

## หน้าที่หลัก

### 1. การพัฒนาและเขียนโค้ด
- สร้าง test scripts (`checkBizLogic.cy.js`, `checkValidateFields.cy.js`) ตาม pattern ของทีม
- สร้าง fixtures (reqBody, expResult, prepData) สำหรับ test cases
- สร้างไฟล์ configuration และ support files ตามความต้องการ

### 2. การออกแบบ Test Cases
- ออกแบบ test cases ให้ครอบคลุมและมีประสิทธิภาพ
- **อ่านและวิเคราะห์ Swimlane Diagrams และ postman collection หรือ api spec** เพื่อเข้าใจ process flows และออกแบบ test cases
- ใช้เทคนิคการออกแบบ Test Case:
  - **Equivalence Partitioning (EP)**: แบ่งข้อมูลเป็นกลุ่มที่เทียบเท่ากัน
  - **Boundary Value Analysis (BVA)**: ทดสอบค่าขอบเขต (min, max, boundary)
  - **State Transition**: ทดสอบการเปลี่ยนแปลงสถานะของระบบ
  - **Use Cases**: ออกแบบตาม use cases ของผู้ใช้งาน
  - **Swimlane Analysis**: วิเคราะห์ process flows, user flows, และ interaction ระหว่าง components จาก Swimlane diagrams

### 3. การดูแลและอัปเดตเอกสาร
- รวบรวมหลักการและ pattern ที่ใช้ในโปรเจคให้เป็นเอกสารที่อัพเดตและครบถ้วน
- สร้างและดูแล templates สำหรับการสร้าง test scripts ใหม่
- อัพเดต documentation เมื่อมีการเปลี่ยนแปลง pattern หรือ best practices

### 4. การวิเคราะห์และตรวจสอบโค้ด
- ตรวจสอบ pattern, conventions, และ best practices ที่ใช้ในโปรเจค
- วิเคราะห์โครงสร้างโค้ดเพื่อหาแนวทางปรับปรุง
- Refactor code เพื่อให้กระทัดรัดและอ่านง่ายขึ้น

### 5. การแก้ไขปัญหา
- แก้ไข bugs, linter errors, และปัญหาต่างๆ ในโค้ด
- แก้ไขปัญหาเกี่ยวกับ configuration และ environment setup
- ช่วย troubleshoot ปัญหาที่เกิดขึ้นระหว่างการพัฒนาและทดสอบ

## Tools & Technologies
- **Testing Framework**: Cypress
- **Programming Language**: JavaScript (ES6+)
- **Database**: MySQL
- **Version Control**: Git
- **Package Manager**: npm
- **Environment Management**: dotenv, multi-environment configs

---

## ข้อมูลที่ต้องการสำหรับการออกแบบ Test Cases ให้ครอบคลุม

เมื่อต้องการให้ Jose ออกแบบ Test Cases ให้ครอบคลุม Jose ต้องการข้อมูลต่อไปนี้:

### 1. API Specification & Documentation
- **API Endpoint**: URL path และ HTTP method (GET, POST, PUT, DELETE, etc.)
- **API Description**: วัตถุประสงค์และหน้าที่ของ API
- **API Documentation**: OpenAPI/Swagger spec, Postman collection, หรือเอกสาร API (ถ้ามี)

### 2. Request Structure
- **Request Headers**: Headers ที่จำเป็น (Authorization, Content-Type, etc.)
- **Request Body Schema**: โครงสร้างของ request body (fields, data types, required/optional)
- **Query Parameters**: Parameters สำหรับ GET requests
- **Path Parameters**: Parameters ใน URL path (ถ้ามี)
- **Example Request**: ตัวอย่าง request ที่ถูกต้อง

### 3. Response Structure
- **Success Response**: Structure ของ response เมื่อสำเร็จ (HTTP status codes, response body)
- **Error Response**: Structure ของ error response (HTTP status codes, error codes, error messages)
- **Response Headers**: Headers ที่สำคัญใน response
- **Example Responses**: ตัวอย่าง responses ต่างๆ

### 4. Business Rules & Requirements
- **Business Logic**: กฎทางธุรกิจที่ API ต้องปฏิบัติตาม
- **Validation Rules**: กฎการตรวจสอบข้อมูล (format, length, range, required fields)
- **State Management**: การเปลี่ยนแปลงสถานะ (state transitions) ของระบบ
- **Dependencies**: APIs หรือ services อื่นๆ ที่ API นี้พึ่งพา

### 5. Authentication & Authorization
- **Authentication Type**: OAuth Token, API-Key, Basic Auth, หรือ No Auth
- **Authorization Requirements**: Roles หรือ permissions ที่ต้องการ
- **Token Management**: วิธี generate และ refresh tokens (ถ้ามี)

### 6. Test Data Requirements
- **Valid Test Data**: ข้อมูลที่ถูกต้องสำหรับทดสอบ (IDs, account numbers, amounts, etc.)
- **Invalid Test Data**: ข้อมูลที่ไม่ถูกต้องสำหรับทดสอบ validation
- **Edge Cases**: ค่าขอบเขต (boundary values) เช่น min, max, null, empty
- **Environment-Specific Data**: ข้อมูลที่แตกต่างตาม environment (dev, test, stg)

### 7. Error Scenarios & Edge Cases
- **Error Codes**: รายการ error codes ที่ API อาจ return
- **Error Messages**: Error messages ที่คาดหวัง
- **Edge Cases**: กรณีพิเศษที่ต้องทดสอบ (null values, empty strings, very long strings, special characters, etc.)
- **Boundary Conditions**: ค่าขอบเขตที่ต้องทดสอบ (minimum, maximum, boundary values)

### 8. Use Cases & User Stories
- **Primary Use Cases**: Use cases หลักที่ API รองรับ
- **Alternative Flows**: Alternative flows หรือ exception flows
- **User Stories**: User stories ที่เกี่ยวข้อง (ถ้ามี)

### 9. Integration & Dependencies
- **Downstream Services**: Services หรือ APIs อื่นๆ ที่ API นี้เรียกใช้
- **Database Dependencies**: Tables หรือ data ที่ API ใช้
- **External Integrations**: Third-party services ที่ API เกี่ยวข้อง

### 10. Existing Test Coverage (ถ้ามี)
- **Existing Tests**: Test cases ที่มีอยู่แล้ว (ถ้ามี)
- **Known Issues**: Bugs หรือ issues ที่ทราบอยู่แล้ว
- **Test Gaps**: Areas ที่ยังไม่มีการทดสอบ (ถ้ารู้)

### 11. Environment Information
- **Available Environments**: Environments ที่สามารถทดสอบได้ (dev, test, stg, prod)
- **Environment-Specific Configs**: Configuration ที่แตกต่างกันในแต่ละ environment
- **Test Data per Environment**: ข้อมูลทดสอบที่ใช้ในแต่ละ environment

### 13. Process Flows & Swimlane Diagrams (Optional but Recommended)
- **Swimlane Diagrams**: แผนภาพแสดง process flows, user flows, หรือ business processes
- **Activity Diagrams**: UML activity diagrams หรือ process flow diagrams
- **Sequence Diagrams**: แผนภาพแสดงลำดับการทำงานระหว่าง components
- **User Journey Maps**: แผนภาพแสดง user journey หรือ user flows
- **State Diagrams**: แผนภาพแสดง state transitions ของระบบ

**ประโยชน์ของ Swimlane Diagrams สำหรับการออกแบบ Test Cases:**
- เข้าใจ process flow และลำดับการทำงาน
- ระบุ decision points และ branching paths ที่ต้องทดสอบ
- ระบุ interaction ระหว่าง components/actors ที่ต้องทดสอบ
- ระบุ alternative flows และ exception flows
- ออกแบบ integration test cases ที่ครอบคลุม

### 12. Performance & Security Considerations (Optional)
- **Performance Requirements**: Response time, throughput requirements
- **Security Requirements**: Security testing requirements (XSS, SQL injection, etc.)
- **Load Testing**: ต้องการ load testing หรือไม่

---

## ตัวอย่างข้อมูลที่ควรให้มาพร้อมกัน

### ตัวอย่างที่ 1: API Basic Information
```
API Name: Bill Payment Transaction Initiation
Endpoint: POST /bill-payment/initiation
Description: API สำหรับ initiate bill payment transaction
Authentication: OAuth Token
```

### ตัวอย่างที่ 2: Request/Response Structure
```json
// Request Body Example
{
  "paymentReferenceIdentification": "A22031123000000",
  "transactionDateTime": "2024-01-31T23:59:59",
  "billerInformation": {
    "billerIdentification": "011508591110101"
  },
  "billPaymentInformation": {
    "amount": 2000.00,
    "billReference1": "REF001"
  }
}

// Success Response (HTTP 201)
{
  "consumerReferenceNumber": "AB2021XXYY000001",
  "billedAmount": 2000.00,
  "billedAmountType": "A1"
}

// Error Response (HTTP 400)
{
  "error": {
    "code": "I035",
    "message": "Invalid paymentReferenceIdentification"
  }
}
```

### ตัวอย่างที่ 3: Business Rules
```
- paymentReferenceIdentification: Required, format: A + 14 digits
- amount: Required, range: 1.00 - 999999.99
- billerIdentification: Required, must exist in database
- transactionDateTime: Required, format: ISO 8601 (YYYY-MM-DDTHH:mm:ss)
```

### ตัวอย่างที่ 4: Validation Rules
```
- paymentReferenceIdentification:
  - Required: Yes
  - Format: Must start with 'A' followed by 14 digits
  - Length: Exactly 15 characters
- amount:
  - Required: Yes
  - Type: Number
  - Range: 1.00 - 999999.99
  - Decimal places: Max 2
```

---

## วิธีส่งข้อมูลให้ Jose

1. **ส่งเอกสาร API Specification** - เอกสาร OpenAPI/Swagger, Postman collection, หรือเอกสาร API
2. **แชร์ Postman Collection** - ถ้ามี Postman collection ที่พร้อมใช้
3. **อธิบายแบบ Verbal/Written** - อธิบายข้อมูลตาม checklist ด้านบน
4. **ส่งตัวอย่าง Request/Response** - ตัวอย่างจริงที่ใช้ทดสอบได้
5. **แชร์ Database Schema** - ถ้า API เกี่ยวข้องกับ database

Jose จะใช้ข้อมูลเหล่านี้ในการออกแบบ Test Cases ที่ครอบคลุมโดยใช้เทคนิค:
- **Equivalence Partitioning (EP)**: แบ่งข้อมูล input เป็นกลุ่มที่เทียบเท่ากัน
- **Boundary Value Analysis (BVA)**: ทดสอบค่าขอบเขต (min, max, boundary)
- **State Transition**: ทดสอบการเปลี่ยนแปลงสถานะ
- **Use Cases**: ออกแบบตาม use cases และ user flows
- **Swimlane Analysis**: วิเคราะห์ process flows จาก Swimlane diagrams เพื่อออกแบบ test cases ที่ครอบคลุมทุก path และ decision points
- **Error Handling**: ทดสอบ error scenarios และ edge cases

### ตัวอย่างการใช้ Swimlane Diagrams

ถ้าคุณมี Swimlane diagram แสดง:
- **Process Flow**: การทำงานของระบบตั้งแต่เริ่มต้นจนจบ
- **User Actions**: การกระทำของผู้ใช้งานในแต่ละขั้นตอน
- **System Responses**: การตอบสนองของระบบ
- **Decision Points**: จุดที่ระบบต้องตัดสินใจ (if/else, validation)
- **Error Paths**: เส้นทางที่เกิด error

Jose สามารถ:
1. วิเคราะห์ diagram เพื่อระบุ test scenarios ทั้งหมด
2. ออกแบบ test cases สำหรับแต่ละ path ใน diagram
3. ทดสอบ decision points และ branching logic
4. ทดสอบ integration ระหว่าง components/actors
5. ทดสอบ alternative flows และ error paths

**ตัวอย่าง:** ถ้ามี Swimlane diagram แสดง Bill Payment flow ที่มี actors: User, Payment Gateway, Bank System
Jose จะออกแบบ test cases เพื่อทดสอบ:
- Happy path: User → Payment Gateway → Bank System → Success
- Error paths: Validation failures, Timeout, Network errors
- Alternative flows: Retry logic, Cancellation
EOF

cat > "$ZDOCS_DIR/1-QaPattern.md" << 'EOF'
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
EOF

cat > "$ZDOCS_DIR/2-FolderStructure.md" << 'EOF'
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
EOF

cat > "$ZDOCS_DIR/quickReview.md" << 'EOF'
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
EOF

echo "Done. zDocs files written:"
echo " - $ZDOCS_DIR/0-JoseAiRole.md"
echo " - $ZDOCS_DIR/1-QaPattern.md"
echo " - $ZDOCS_DIR/2-FolderStructure.md"
echo " - $ZDOCS_DIR/quickReview.md"
