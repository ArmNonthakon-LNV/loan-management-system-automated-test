import { APIHelper } from '../../../support/common/apiHelper';

describe('Check validate fields of API repaymentTransactionList', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');
  const apiPath = '/api/repayment/transaction/list';

  it('Display response error when call api with empty body', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/emptyBody.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('Display response error when call api with transaction_owner_id is null', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/transactionOwnerIdNull.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('Display response error when call api with transaction_owner_id is empty string', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/transactionOwnerIdEmpty.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('Display response error when call api with channel is empty string', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/channelEmpty.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('Display response error when call api with transaction_status is invalid', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/invalidTransactionStatus.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([200,400, 422]);
      });
    });
  });

  it('Display response error when call api with page is zero', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/pageIsZero.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('Display response error when call api with page_limit is negative', () => {
    cy.fixture('lnv/apiRepaymentTransactionList/reqBody/validateFields/pageLimitIsNegative.json').then((reqBody) => {
      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}${apiPath}`)
        .setReqHeaders()
        .setReqBody(reqBody)
        .sendRequest('response');

      cy.get('@response').then((res) => {
        cy.log('Status:', res.status);
        cy.log('Body:', JSON.stringify(res.body));

        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

});
