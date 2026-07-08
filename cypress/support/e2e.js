// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Custom command for recording validation evidents to Excel via task
Cypress.Commands.add('recordEvident', (payload = {}) => {
  const currentTest = Cypress.currentTest || {};
  const testTitle = payload.testTitle || currentTest.title || '';
  const testDate = new Date().toISOString();
  const testedBy = Cypress.env('testedBy') || Cypress.env('TESTED_BY') || '';

  const finalPayload = {
    ...payload,
    testTitle,
    testDate,
    testedBy,
  };

  return cy.task('appendToValidationErrorReport', finalPayload);
});

// Automatically record an evident row after each test using its status and title
afterEach(function () {
  const test = this.currentTest || {};
  const state = (test.state || '').toLowerCase();

  let status = 'NORUN';
  if (state === 'passed') {
    status = 'PASSED';
  } else if (state === 'failed') {
    status = 'FAILED';
  }

  // พยายามดึง Test Case ID จากชื่อเทสต์ถ้ามีรูปแบบ [TC-XXXX] ที่หัวข้อ
  const title = test.title || '';
  const idMatch = title.match(/^\[(TC-[^\]]+)\]/i);
  const testCaseId = idMatch ? idMatch[1] : '';

  cy.recordEvident({
    status,
    testCaseId,
  });
});
