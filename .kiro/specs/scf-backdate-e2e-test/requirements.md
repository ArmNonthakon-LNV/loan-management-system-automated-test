# Requirements Document

## Introduction

This spec defines the E2E automated test for the SimpleCashFlow (SCF) Backdate Repayment flow via API. The test exercises the complete maker-checker workflow: a maker user creates and submits a backdate repayment transaction, then a checker user approves it. The test verifies API responses at each step and validates data correctness in the database.

## Glossary

- **Test_Suite**: The Cypress E2E test spec file that orchestrates the SCF backdate repayment flow
- **APIHelper**: The shared utility class (`cypress/support/common/apiHelper.js`) used to build and send HTTP requests
- **Maker_User**: A user with the "maker" role who creates and submits repayment transactions
- **Checker_User**: A user with the "checker" role who approves submitted repayment transactions
- **Login_API**: POST `/api/login` endpoint that authenticates a user and returns a JWT token
- **Backdate_Calculate_API**: POST `/api/repayment/simple-cash-flow/backdate-calculate` endpoint that calculates repayment amounts for a backdate transaction before creation
- **Create_API**: POST `/api/repayment/simple-cash-flow/create` endpoint that creates a new SCF repayment transaction
- **Submit_API**: POST `/api/repayment/simple-cash-flow/submit` endpoint that submits a created repayment for approval
- **Approve_API**: POST `/api/repayment/simple-cash-flow/approved` endpoint that approves a submitted repayment
- **JWT_Token**: The authentication token returned by the Login_API, used as Bearer token in subsequent requests
- **Transaction_ID**: The unique identifier returned by the Create_API, used in Submit and Approve steps
- **Reference_Loan_No**: The reference loan number returned by the Create_API, used in the Approve step
- **Backdate_Repayment**: A repayment where the effective_date/transaction_eff_date is set to a past date
- **Base_URL**: The UAT environment URL `https://uat-lms-portal.lendocraft.com`

## Requirements

### Requirement 1: Maker Login Authentication

**User Story:** As a test engineer, I want the test to authenticate as a maker user, so that subsequent API calls have a valid authorization token.

#### Acceptance Criteria

1. WHEN the Test_Suite starts, THE Test_Suite SHALL send a POST request to the Login_API with a JSON body containing "username" and "password" fields populated from the maker environment variables (Cypress.env('makerUsername') and Cypress.env('makerPassword'))
2. IF the maker environment variables (makerUsername or makerPassword) are undefined or empty, THEN THE Test_Suite SHALL fail the test with an error message indicating which environment variable is missing
3. WHEN the Login_API returns HTTP status 200 with response_code 0 and a non-empty jwt_token in the data field, THE Test_Suite SHALL store the JWT_Token and attach it as a Bearer token in the Authorization header for all subsequent Backdate_Calculate_API, Create_API, and Submit_API requests
4. IF the Login_API returns HTTP status 200 but response_code is not 0, THEN THE Test_Suite SHALL fail the test with an error message indicating the response_code and response_message returned by the Login_API
5. IF the Login_API returns a non-200 HTTP status code or the request fails due to a network error, THEN THE Test_Suite SHALL fail the test with an error message indicating the HTTP status code or network error encountered

### Requirement 2: Backdate Calculate Repayment

**User Story:** As a test engineer, I want the test to call the backdate calculate API before creating the transaction, so that the repayment calculation is validated prior to creation.

#### Acceptance Criteria

1. WHEN the Maker_User JWT_Token is available, THE Test_Suite SHALL send a POST request to the Backdate_Calculate_API at path `/api/repayment/simple-cash-flow/backdate-calculate` with the Authorization Bearer header set to the Maker_User JWT_Token and a request body containing channel, transaction_owner_id, effective_date, loan_contract_id, repayment_amount, calculation_period, and need_close_account fields
2. THE Test_Suite SHALL set the transaction_owner_id field in the Backdate_Calculate_API request body to "331" matching the maker user's transaction owner identifier
3. WHEN the Backdate_Calculate_API returns HTTP status 200 with response_code 0, THE Test_Suite SHALL assert that the response body data object contains principle_balance, repayment_calculation, and effective_date_calculation fields with numeric or object values
4. IF the Backdate_Calculate_API returns a non-200 HTTP status code or a response body with a non-zero response_code, THEN THE Test_Suite SHALL fail the test and log the HTTP status code and full response body for diagnosis
5. IF the Maker_User JWT_Token is not available when the Backdate_Calculate_API request is attempted, THEN THE Test_Suite SHALL fail the test with a message indicating the authentication token is missing

### Requirement 3: Create SCF Backdate Repayment Transaction

**User Story:** As a test engineer, I want the test to create a SimpleCashFlow backdate repayment order, so that the maker workflow step is validated.

#### Acceptance Criteria

1. WHEN the Maker_User JWT_Token is available and the Backdate_Calculate step completes successfully, THE Test_Suite SHALL send a POST request to the Create_API at path /api/repayment/simple-cash-flow/create with the Authorization Bearer header set to the Maker_User JWT_Token and the repayment request body loaded from the SCF backdate fixture file
2. THE Test_Suite SHALL set the transaction_eff_date field in the Create_API request body to a date at least 1 calendar day before the current date in ISO 8601 format (YYYY-MM-DD) to validate backdate functionality
3. WHEN the Create_API returns HTTP status 200 with response_code 0, THE Test_Suite SHALL extract the transaction_id and reference_loan_no values from the response body data object and store them as shared test variables for use in subsequent workflow steps
4. IF the Create_API returns a non-200 HTTP status code or a response body with a non-zero response_code, THEN THE Test_Suite SHALL fail the test and log the HTTP status code and full response body for diagnosis
5. IF the Maker_User JWT_Token is not available when the Create_API request is attempted, THEN THE Test_Suite SHALL fail the test with a message indicating the authentication token is missing

### Requirement 4: Submit SCF Repayment Transaction

**User Story:** As a test engineer, I want the test to submit the created repayment transaction, so that it moves to the pending-approval state.

#### Acceptance Criteria

1. WHEN the Transaction_ID is available from the Create step, THE Test_Suite SHALL verify the Transaction_ID is a non-empty string, then send a POST request to `/api/repayment/simple-cash-flow/submit` with the Maker_User JWT_Token in the Authorization header (Bearer token), and a request body containing transaction_owner_id set to "331", channel set to "WEB", and the Transaction_ID
2. WHEN the Submit_API returns HTTP status 200 with response_code 0, THE Test_Suite SHALL assert that the response status equals 200, the response body field response_code equals 0, and log the Transaction_ID as successfully submitted
3. IF the Submit_API returns a non-200 HTTP status code or a response body where response_code is not equal to 0, THEN THE Test_Suite SHALL fail the test and log the HTTP status code and the full response body for diagnosis
4. IF the Transaction_ID from the Create step is null or undefined, THEN THE Test_Suite SHALL skip the submit request and fail the test with a message indicating the prerequisite Create step did not produce a valid Transaction_ID

### Requirement 5: Checker Login Authentication

**User Story:** As a test engineer, I want the test to authenticate as a checker user, so that the approval step uses a different authorized user.

#### Acceptance Criteria

1. WHEN the Submit step completes successfully, THE Test_Suite SHALL send a POST request to the Login_API endpoint `/api/login` with a JSON body containing `username` from `Cypress.env('checkerUsername')` and `password` from `Cypress.env('checkerPassword')`
2. WHEN the Login_API returns HTTP status 200 with a response body containing a `jwt_token` field, THE Test_Suite SHALL store the `jwt_token` value as the Checker_User access token for use in the subsequent Approve_API request
3. IF the Login_API returns a non-200 HTTP status code, THEN THE Test_Suite SHALL fail the test with an error message indicating the received status code and response body
4. IF the `checkerUsername` or `checkerPassword` environment variable is not defined or is empty, THEN THE Test_Suite SHALL fail the test with an error message indicating which credential environment variable is missing
5. WHEN the Test_Suite sends the checker login request, THE Test_Suite SHALL receive a response within 90 seconds or fail the test with a timeout error

### Requirement 6: Approve SCF Repayment Transaction

**User Story:** As a test engineer, I want the test to approve the submitted repayment using a checker user, so that the maker-checker workflow is fully validated.

#### Acceptance Criteria

1. WHEN the Checker_User JWT_Token is obtained from the authentication step and the Transaction_ID and Reference_Loan_No are obtained from the preceding create transaction step, THE Test_Suite SHALL send a POST request to the Approve_API endpoint `/api/repayment/simple-cash-flow/approved` with the Checker_User Bearer token in the Authorization header and a request body containing transaction_owner_id set to "238", channel set to "WEB", the Transaction_ID from the create step, reference_loan_no from the create step, and eff_date matching the transaction_eff_date used in the create request body in ISO 8601 format with timezone offset
2. WHEN the Approve_API returns HTTP status 200 with response_code 0, THE Test_Suite SHALL assert that the response status equals 200 and response body field `response_code` equals 0, confirming the approval was processed
3. IF the Approve_API returns a non-200 HTTP status code or a response body with a non-zero response_code, THEN THE Test_Suite SHALL fail the test and log the HTTP status code and the full response body for diagnosis
4. IF the Checker_User JWT_Token is the same user as the Maker who created the transaction, THEN THE Test_Suite SHALL fail the test indicating that the maker-checker separation constraint is violated
5. THE Test_Suite SHALL complete the Approve_API request and receive a response within 90 seconds

### Requirement 7: Database Verification After Approval

**User Story:** As a test engineer, I want the test to verify the database state after approval, so that data integrity is confirmed end-to-end.

#### Acceptance Criteria

1. WHEN the Approve step completes with HTTP status 200 and response_code 0, THE Test_Suite SHALL query the repayment_transaction table using cy.task('queryDbLNV') with a SELECT query filtered by the transaction_id returned from the Create step, limited to 1 row
2. IF the database query returns an empty result (0 rows), THEN THE Test_Suite SHALL fail the test with an assertion message indicating no transaction record was found for the given transaction_id
3. THE Test_Suite SHALL verify that the transaction_status column in the returned database row equals the string value 'Approved'
4. THE Test_Suite SHALL verify that the effective_date column in the returned database row equals the backdate value sent in the Create request body, compared as string values in the same date format
5. THE Test_Suite SHALL verify each repayment amount column (principal, interest, penalty, fee) in the returned database row by comparing the parseFloat value of each column against the corresponding numeric value sent in the Create request body

### Requirement 8: Test Data and Fixture Structure

**User Story:** As a test engineer, I want request bodies managed in fixture files, so that test data is easy to maintain and update.

#### Acceptance Criteria

1. THE Test_Suite SHALL load Create_API request body data using `cy.fixture()` from JSON files located under `cypress/fixtures/lnv/scfRepayment/reqBody/`, organized into subfolders by test category (e.g., `bizLogic/`, `validateFields/`)
2. THE Test_Suite SHALL load expected result values using `cy.fixture()` from JSON files located under `cypress/fixtures/lnv/scfRepayment/expResult/`, organized into subfolders matching the corresponding `reqBody/` category structure
3. THE Test_Suite SHALL use `Cypress.env()` to retrieve the following environment-specific values: `endPoint` (Base URL), maker credentials, and checker credentials, as defined in the environment config file (`cypress/config/{env}.json`) or `.env`
4. IF a required fixture file does not exist at the expected path, THEN THE Test_Suite SHALL fail with a file-not-found error before the API request is sent
5. THE Test_Suite SHALL NOT contain hardcoded credentials, base URLs, or environment-specific values in test files or fixture files
