/**
 * GetLnvTbLoan - Helper class for querying loan table from LNV database
 */

class GetLnvTbLoan {
  getLoanByCustomerId(customerId) {
    const query = `SELECT * FROM loan WHERE customer_id = '${customerId}' ORDER BY created_at DESC`;
    return cy.task('queryDbLNV', query);
  }

  getLoanById(loanId) {
    const query = `SELECT * FROM loan WHERE id = '${loanId}'`;
    return cy.task('queryDbLNV', query);
  }

  getLoanByStatus(status, limit = 10) {
    const query = `SELECT * FROM loan WHERE status = '${status}' ORDER BY created_at DESC LIMIT ${limit}`;
    return cy.task('queryDbLNV', query);
  }
}

export const onGetLnvTbLoan = new GetLnvTbLoan();
