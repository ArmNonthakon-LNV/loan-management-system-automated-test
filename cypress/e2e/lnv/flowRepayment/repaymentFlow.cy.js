import { APIHelper } from '../../../support/common/apiHelper';

/**
 * Flow Test: Repayment (Create Order → Confirm → Verify DB)
 * 
 * ทดสอบ flow การ repay เงินกู้แบบครบ loop:
 * 1. สร้าง repayment order
 * 2. ใช้ order_id จาก step 1 เพื่อ confirm
 * 3. ตรวจสอบ transaction list ว่ามี record ใหม่
 * 4. ตรวจสอบ Database ว่าข้อมูลถูกบันทึกถูกต้อง
 */

describe('Flow: Repayment - Create Order and Confirm', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');

  // ตัวแปรที่จะ pass ข้าม step
  let orderId;
  let transactionId;
  let customerId;
  let requestAmount;

  it('Step 1: Create repayment order', () => {
    const apiPath = '/api/repayment/order/create'; // ปรับตาม API จริง

    cy.fixture('lnv/flowRepayment/createOrder.json').then((reqBody) => {
      // เก็บค่าจาก request ไว้เทียบกับ DB ทีหลัง
      customerId = reqBody.customer_id;
      requestAmount = reqBody.request_amount;

      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('createResponse');

      cy.get('@createResponse').then((res) => {
        cy.log('Create Order Status:', res.status);
        cy.log('Create Order Body:', JSON.stringify(res.body));

        expect(res.status).to.eq(200);
        expect(res.body.response_code).to.eq(0);

        // เก็บ order_id / transaction_id ไว้ใช้ step ถัดไป
        orderId = res.body.data.order_id;
        transactionId = res.body.data.transaction_id;

        cy.log('Order ID:', orderId);
        cy.log('Transaction ID:', transactionId);
      });
    });
  });

  it('Step 2: Confirm repayment order', () => {
    const apiPath = '/api/repayment/order/confirm'; // ปรับตาม API จริง

    const reqBody = {
      order_id: orderId,
      transaction_id: transactionId,
      confirm_status: 'confirmed'
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}${apiPath}`)
      .setReqHeaders()
      .setReqBody(reqBody)
      .sendRequest('confirmResponse');

    cy.get('@confirmResponse').then((res) => {
      cy.log('Confirm Status:', res.status);
      cy.log('Confirm Body:', JSON.stringify(res.body));

      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
    });
  });

  it('Step 3: Verify transaction appears in list', () => {
    const apiPath = '/api/repayment/transaction/list';

    const reqBody = {
      transaction_owner_id: 'user0001',
      channel: 'WEB,API',
      query_param: {
        transaction_status: 'Confirmed',
        sort_by: 'updated_time',
        sort_method: 'DESC'
      },
      page: 1,
      page_limit: 10
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}${apiPath}`)
      .setReqHeaders()
      .setReqBody(reqBody)
      .sendRequest('listResponse');

    cy.get('@listResponse').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);

      // ตรวจว่า transaction ที่เพิ่งสร้างอยู่ใน list
      const found = res.body.data.transactions.find(
        (txn) => txn.order_id === orderId
      );
      expect(found, `Transaction with order_id ${orderId} should exist`).to.not.be.undefined;
      expect(found.transaction_status).to.eq('Confirmed');
    });
  });

  // ============================================================
  // Step 4: Compare with Database
  // ============================================================

  it('Step 4: Verify repayment order saved correctly in DB', () => {
    // Query ตาราง repayment_order (ปรับชื่อตาราง/column ตาม schema จริง)
    const query = `
      SELECT * FROM repayment_order 
      WHERE order_id = '${orderId}' 
      LIMIT 1
    `;

    cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.be.an('array');
      expect(rows.length).to.eq(1, 'Should find exactly 1 order in DB');

      const dbRecord = rows[0];
      cy.log('DB Record:', JSON.stringify(dbRecord));

      // เทียบค่าที่ส่งไปกับค่าที่ save ใน DB
      expect(dbRecord.customer_id).to.eq(customerId);
      expect(parseFloat(dbRecord.request_amount)).to.eq(requestAmount);
      expect(dbRecord.payment_method).to.eq('ThaiQR');
      expect(dbRecord.order_status).to.eq('confirmed'); // หลัง confirm แล้ว
    });
  });

  it('Step 5: Verify transaction record in DB', () => {
    // Query ตาราง repayment_transaction (ปรับชื่อตาราง/column ตาม schema จริง)
    const query = `
      SELECT * FROM repayment_transaction 
      WHERE transaction_id = '${transactionId}' 
      LIMIT 1
    `;

    cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.be.an('array');
      expect(rows.length).to.eq(1, 'Should find exactly 1 transaction in DB');

      const dbRecord = rows[0];
      cy.log('DB Transaction:', JSON.stringify(dbRecord));

      // ตรวจ status ใน DB ตรงกับที่ confirm ไป
      expect(dbRecord.transaction_status).to.eq('Confirmed');
      expect(dbRecord.order_id).to.eq(orderId);
      expect(dbRecord.customer_id).to.eq(customerId);
      expect(parseFloat(dbRecord.request_amount)).to.eq(requestAmount);
    });
  });

  it('Step 6: Verify loan balance updated in DB', () => {
    // ตรวจว่ายอดเงินกู้ถูกหักถูกต้อง (ปรับตาม schema จริง)
    const query = `
      SELECT * FROM loan_account 
      WHERE loan_account_id = '1234567890' 
      LIMIT 1
    `;

    cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.be.an('array');
      expect(rows.length).to.be.greaterThan(0);

      const loanAccount = rows[0];
      cy.log('Loan Account:', JSON.stringify(loanAccount));

      // ตรวจสอบว่า paid_amount เพิ่มขึ้นตาม request_amount
      // หรือ outstanding_balance ลดลง
      // (ปรับ assertion ตาม business logic จริง)
      expect(parseFloat(loanAccount.last_payment_amount)).to.eq(requestAmount);
    });
  });

});
