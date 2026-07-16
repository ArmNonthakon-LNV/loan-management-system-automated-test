# Implementation Plan: SCF Backdate E2E Test

## Overview

Implement the Cypress E2E test for the SimpleCashFlow (SCF) Backdate Repayment maker-checker workflow. This involves creating fixture files for request bodies and expected results, adding environment variables for maker/checker credentials, and writing the complete 7-step test file that exercises login → calculate → create → submit → checker login → approve → DB verification.

## Tasks

- [x] 1. Create fixture files for request bodies and expected results
  - [x] 1.1 Create backdate calculate request body fixture
    - Create `cypress/fixtures/lnv/scfRepayment/reqBody/bizLogic/backdateCalculate.json`
    - Include fields: channel ("WEB"), transaction_owner_id ("331"), effective_date (past date in YYYY-MM-DD), loan_contract_id, repayment_amount, calculation_period, need_close_account
    - _Requirements: 2.1, 2.2, 8.1_

  - [x] 1.2 Create SCF backdate create request body fixture
    - Create `cypress/fixtures/lnv/scfRepayment/reqBody/bizLogic/createBackdate.json`
    - Include fields: channel ("WEB"), transaction_owner_id ("331"), transaction_eff_date (past date in YYYY-MM-DD), loan_contract_id, repayment_amount, principal, interest, penalty, fee, need_close_account
    - Ensure transaction_eff_date is at least 1 calendar day before today
    - _Requirements: 3.1, 3.2, 8.1_

  - [x] 1.3 Create backdate calculate expected result fixture
    - Create `cypress/fixtures/lnv/scfRepayment/expResult/bizLogic/backdateCalculateSuccess.json`
    - Include expected response fields: response_code (0), and data fields (principle_balance, repayment_calculation, effective_date_calculation)
    - _Requirements: 2.3, 8.2_

  - [x] 1.4 Create SCF backdate create expected result fixture
    - Create `cypress/fixtures/lnv/scfRepayment/expResult/bizLogic/createBackdateSuccess.json`
    - Include expected response fields: response_code (0), and data field names (transaction_id, reference_loan_no) for assertion reference
    - _Requirements: 3.3, 8.2_

- [x] 2. Add maker and checker environment variables
  - [x] 2.1 Add maker/checker credentials to the .env file
    - Add `MAKER_USERNAME`, `MAKER_PASSWORD`, `CHECKER_USERNAME`, `CHECKER_PASSWORD` entries to `.env`
    - Leave values as placeholders for the user to fill in with actual credentials
    - _Requirements: 1.1, 5.1, 8.3, 8.5_

  - [x] 2.2 Update cypress.config.js to pass maker/checker env vars to Cypress
    - In the `setupNodeEvents` function, add logic to read `MAKER_USERNAME`, `MAKER_PASSWORD`, `CHECKER_USERNAME`, `CHECKER_PASSWORD` from `process.env` and assign them to `configure.env` as `makerUsername`, `makerPassword`, `checkerUsername`, `checkerPassword`
    - _Requirements: 1.1, 5.1, 8.3_

- [x] 3. Checkpoint - Verify fixture files and environment setup
  - Ensure all fixture JSON files are valid and parseable, ask the user if questions arise.

- [x] 4. Implement the main test file (Steps 1-4: Maker flow)
  - [x] 4.1 Write test file scaffold with imports, describe block, and shared state variables
    - Rewrite `cypress/e2e/lnv/scfRepayment/repaymentBackdate.cy.js`
    - Import APIHelper from `'../../../support/common/apiHelper'`
    - Create describe block: `'SCF Backdate Repayment - Maker-Checker Flow'`
    - Declare shared closure variables: makerToken, checkerToken, transactionId, referenceLoanNo, createReqBody
    - Add `before()` hook to validate env vars (makerUsername, makerPassword, checkerUsername, checkerPassword) with descriptive error messages
    - _Requirements: 1.2, 5.4, 8.5_

  - [x] 4.2 Implement Step 1: Maker Login
    - Add `it('Step 1: Maker Login')` block
    - Send POST to `/api/login` with body `{ username: Cypress.env('makerUsername'), password: Cypress.env('makerPassword') }`
    - Use `api.setReqMethod('POST').setReqEndpoint().setReqHeaders().setReqBody().sendRequest()`
    - Assert status 200, response_code 0, jwt_token is non-empty string
    - Store jwt_token in `makerToken` variable
    - Log success with cy.log
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [x] 4.3 Implement Step 2: Backdate Calculate
    - Add `it('Step 2: Backdate Calculate')` block
    - Guard: assert makerToken is not undefined
    - Load fixture from `lnv/scfRepayment/reqBody/bizLogic/backdateCalculate.json`
    - Send POST to `/api/repayment/simple-cash-flow/backdate-calculate` with Bearer token via `setReqHeadersWithAuth('en_US', makerToken)`
    - Assert status 200, response_code 0
    - Assert response data contains principle_balance, repayment_calculation, effective_date_calculation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.4 Implement Step 3: Create SCF Backdate
    - Add `it('Step 3: Create SCF Backdate Transaction')` block
    - Guard: assert makerToken is not undefined
    - Load fixture from `lnv/scfRepayment/reqBody/bizLogic/createBackdate.json`
    - Store loaded fixture in `createReqBody` for later DB comparison
    - Send POST to `/api/repayment/simple-cash-flow/create` with Bearer token
    - Assert status 200, response_code 0
    - Extract and store `transactionId` and `referenceLoanNo` from response data
    - Log extracted values with cy.log
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.5 Implement Step 4: Submit
    - Add `it('Step 4: Submit SCF Repayment')` block
    - Guard: assert transactionId is a non-empty string
    - Build request body inline: `{ channel: "WEB", transaction_owner_id: "331", transaction_id: transactionId }`
    - Send POST to `/api/repayment/simple-cash-flow/submit` with Bearer token (makerToken)
    - Assert status 200, response_code 0
    - Log successful submission
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Implement the main test file (Steps 5-7: Checker flow and DB verification)
  - [x] 5.1 Implement Step 5: Checker Login
    - Add `it('Step 5: Checker Login')` block
    - Send POST to `/api/login` with body `{ username: Cypress.env('checkerUsername'), password: Cypress.env('checkerPassword') }`
    - Use `api.setReqMethod('POST').setReqEndpoint().setReqHeaders().setReqBody().sendRequest()`
    - Assert status 200, response_code 0, jwt_token is non-empty string
    - Store jwt_token in `checkerToken` variable
    - Verify maker-checker separation: assert `Cypress.env('makerUsername') !== Cypress.env('checkerUsername')`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.4_

  - [x] 5.2 Implement Step 6: Approve
    - Add `it('Step 6: Approve SCF Repayment')` block
    - Guard: assert checkerToken, transactionId, and referenceLoanNo are all non-null
    - Build request body: `{ channel: "WEB", transaction_owner_id: "238", transaction_id: transactionId, reference_loan_no: referenceLoanNo, eff_date: createReqBody.transaction_eff_date + "T00:00:00+07:00" }`
    - Send POST to `/api/repayment/simple-cash-flow/approved` with Bearer token (checkerToken)
    - Assert status 200, response_code 0
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [x] 5.3 Implement Step 7: Database Verification
    - Add `it('Step 7: Verify Database After Approval')` block
    - Guard: assert transactionId is not null
    - Execute `cy.task('queryDbLNV', "SELECT * FROM repayment_transaction WHERE transaction_id = '${transactionId}' LIMIT 1")`
    - Assert result is an array with length 1 (exactly 1 row found)
    - Assert `transaction_status` equals 'Approved'
    - Assert `effective_date` matches `createReqBody.transaction_eff_date`
    - Assert `parseFloat(row.principal)` equals `createReqBody.principal`
    - Assert `parseFloat(row.interest)` equals `createReqBody.interest`
    - Assert `parseFloat(row.penalty)` equals `createReqBody.penalty`
    - Assert `parseFloat(row.fee)` equals `createReqBody.fee`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- No property-based tests are included — the design explicitly states PBT does not apply to this E2E integration test feature (fixed fixture inputs against external APIs and database)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The test file uses sequential `it()` blocks with shared closure variables to pass state between steps
- Credentials in `.env` should be filled in by the user with actual test environment values
- The `transaction_eff_date` in the create fixture must be a past date to validate backdate functionality

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "2.1"] },
    { "id": 1, "tasks": ["2.2"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "4.5"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3"] }
  ]
}
```
