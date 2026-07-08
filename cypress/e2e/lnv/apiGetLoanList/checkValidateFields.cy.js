import { APIHelper } from '../../../support/common/apiHelper';

describe('Check validate fields of API getLoanList', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');
  const apiPath = '/api/v1/loans'; // ปรับ path ตาม API จริง

  it('Display response error when call api with empty body', () => {
    const reqBody = {};

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}${apiPath}`)
      .setReqHeaders()
      .setReqBody(reqBody)
      .sendRequest('response');

    cy.get('@response').then((res) => {
      cy.log('Status:', res.status);
      cy.log('Body:', JSON.stringify(res.body));

      expect(res.status).to.eq(400);

      cy.fixture('lnv/apiGetLoanList/expResult/validateFields/emptyBody.json').then((expResult) => {
        expect(res.body.status.code).to.eq(expResult.status.code);
        expect(res.body.status.message).to.eq(expResult.status.message);
      });
    });
  });

  it('Display response error when call api with customerId is null', () => {
    cy.fixture('lnv/apiGetLoanList/reqBody/validateFields/customerIdNull.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        expect(res.status).to.eq(400);

        cy.fixture('lnv/apiGetLoanList/expResult/validateFields/customerIdNull.json').then((expResult) => {
          expect(res.body.status.code).to.eq(expResult.status.code);
          expect(res.body.status.message).to.eq(expResult.status.message);
        });
      });
    });
  });

  it('Display response error when call api with customerId is empty string', () => {
    cy.fixture('lnv/apiGetLoanList/reqBody/validateFields/customerIdEmpty.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        expect(res.status).to.eq(400);

        cy.fixture('lnv/apiGetLoanList/expResult/validateFields/customerIdEmpty.json').then((expResult) => {
          expect(res.body.status.code).to.eq(expResult.status.code);
          expect(res.body.status.message).to.eq(expResult.status.message);
        });
      });
    });
  });

});
