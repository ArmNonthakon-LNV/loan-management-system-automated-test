import { APIHelper } from '../../../support/common/apiHelper';

describe('Check business logic of API getLoanList', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');
  const apiPath = '/api/v1/loans'; // ปรับ path ตาม API จริง

  beforeEach(() => {
    // Pre-condition: เตรียม data หรือ token ถ้าจำเป็น
  });

  it('Display response success when call api with correct data', () => {
    cy.fixture('lnv/apiGetLoanList/reqBody/bizLogic/success.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('status');

        // ตรวจสอบ response ตาม expected result
        cy.fixture('lnv/apiGetLoanList/expResult/bizLogic/success.json').then((expResult) => {
          expect(res.body.status.code).to.eq(expResult.status.code);
          expect(res.body.status.message).to.eq(expResult.status.message);
        });
      });
    });
  });

  it('Display response success when call api and verify data with database', () => {
    cy.fixture('lnv/apiGetLoanList/reqBody/bizLogic/success.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        expect(res.status).to.eq(200);

        // ตรวจสอบข้อมูลกับ Database (PostgreSQL)
        const query = `SELECT * FROM loan WHERE customer_id = '${reqBody.customerId}' LIMIT 1`;
        cy.task('queryDbLNV', query).then((rows) => {
          expect(rows).to.be.an('array');
          expect(rows.length).to.be.greaterThan(0);
          cy.log('DB loan record:', JSON.stringify(rows[0]));
        });
      });
    });
  });

});
