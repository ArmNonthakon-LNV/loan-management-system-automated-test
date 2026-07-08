import { APIHelper } from '../../../support/common/apiHelper';

describe('Check business logic of API repaymentTransactionList', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');
  const apiPath = '/api/repayment/transaction/list';

  it('Display response success when call api with correct data', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/bizLogic/success.json').then((reqBody) => {
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
        expect(res.body.response_code).to.eq(0);
        expect(res.body.response_message).to.eq('Success');
      });
    });
  });

  it('Display response success with pagination when call api with correct data', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/bizLogic/success.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.response_code).to.eq(0);

        // Verify pagination structure
        expect(res.body.pagination).to.have.property('total');
        expect(res.body.pagination).to.have.property('limit');
        expect(res.body.pagination).to.have.property('page');
        expect(res.body.pagination).to.have.property('has_more');
        expect(res.body.pagination.page).to.eq(reqBody.page);
        expect(res.body.pagination.limit).to.eq(reqBody.page_limit);
      });
    });
  });

  it('Display response success with transactions data structure', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/bizLogic/success.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.response_code).to.eq(0);
        expect(res.body.data).to.have.property('transactions');
        expect(res.body.data.transactions).to.be.an('array');

        // If transactions exist, verify structure of first item
        if (res.body.data.transactions.length > 0) {
          const txn = res.body.data.transactions[0];
          expect(txn).to.have.property('transaction_id');
          expect(txn).to.have.property('customer_id');
          expect(txn).to.have.property('loan_account_id');
          expect(txn).to.have.property('order_id');
          expect(txn).to.have.property('payment_method');
          expect(txn).to.have.property('request_amount');
          expect(txn).to.have.property('transaction_status');
          expect(txn).to.have.property('updated_at');
          expect(txn).to.have.property('created_at');

          // Verify filtered by status
          expect(txn.transaction_status).to.eq('Pending');
        }
      });
    });
  });

//   it('Display response success when call api with transaction_owner_id does not have data', () => {
//     const reqBody = {
//       transaction_owner_id: 'nonexistent_user_999',
//       channel: 'WEB,API',
//       query_param: {
//         transaction_status: 'Pending',
//         created_at_start: '2026-06-24 00:00:00.000 +0700',
//         created_at_end: '2026-06-24 23:59:59.000 +0700',
//         sort_by: 'updated_time',
//         sort_method: 'DESC'
//       },
//       page: 1,
//       page_limit: 1000
//     };

//     console.log(reqBody)
//     api
//       .setReqMethod('POST')
//       .setReqEndpoint(`${endPoint}${apiPath}`)
//       .setReqHeaders()
//       .setReqBody(reqBody)
//       .sendRequest('response');

//     cy.get('@response').then((res) => {
//       expect(res.status).to.eq(200);
//       expect(res.body.response_code).to.eq(0);
//       expect(res.body.data.transactions).to.be.an('array');
//       expect(res.body.data.transactions.length).to.eq(5);
//       expect(res.body.pagination.total).to.eq(0);
//     });
//   });

});
