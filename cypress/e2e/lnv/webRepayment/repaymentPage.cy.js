/**
 * Web UI Test: Repayment Page
 * 
 * ทดสอบหน้าเว็บ repayment ผ่าน browser จริง
 * - เปิดหน้า, กรอกข้อมูล, กดปุ่ม, ตรวจผลลัพธ์
 * 
 * ⚠️ ปรับ selector (cy.get) ตาม HTML จริงของหน้าเว็บ
 */

describe('Web UI: Repayment Page', () => {
  const baseUrl = Cypress.env('endPoint'); // https://uat-lms-portal.lendocraft.com

  beforeEach(() => {
    // เปิดหน้า login ก่อน (ถ้าต้อง auth)
    cy.visit(`${baseUrl}/login`);

    // Login
    cy.get('input[name="username"]').type('test_user');
    cy.get('input[name="password"]').type('test_password');
    cy.get('button[type="submit"]').click();

    // รอ redirect หลัง login
    cy.url().should('not.include', '/login');
  });

  it('should display repayment transaction list page', () => {
    cy.visit(`${baseUrl}/repayment/transactions`);

    // ตรวจว่าหน้าโหลดสำเร็จ
    cy.contains('Transaction List').should('be.visible');

    // ตรวจว่ามี table แสดงข้อมูล
    cy.get('table').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should filter transactions by status', () => {
    cy.visit(`${baseUrl}/repayment/transactions`);

    // เลือก filter status = Pending
    cy.get('select[name="status"]').select('Pending');
    cy.get('button').contains('Search').click();

    // ตรวจว่า table แสดงเฉพาะ Pending
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('td.status').should('contain', 'Pending');
    });
  });

  it('should create a new repayment order via form', () => {
    cy.visit(`${baseUrl}/repayment/create`);

    // กรอกฟอร์ม
    cy.get('input[name="customer_id"]').type('1234567890');
    cy.get('input[name="loan_account_id"]').type('1234567890');
    cy.get('input[name="amount"]').type('100');
    cy.get('select[name="payment_method"]').select('ThaiQR');

    // กด Submit
    cy.get('button[type="submit"]').click();

    // ตรวจ success message
    cy.contains('Order created successfully').should('be.visible');
  });

  it('should show validation error when amount is empty', () => {
    cy.visit(`${baseUrl}/repayment/create`);

    // กรอกฟอร์มแต่ไม่ใส่ amount
    cy.get('input[name="customer_id"]').type('1234567890');
    cy.get('input[name="loan_account_id"]').type('1234567890');
    // ไม่กรอก amount

    cy.get('button[type="submit"]').click();

    // ตรวจว่ามี error message
    cy.contains('Amount is required').should('be.visible');
  });

});
