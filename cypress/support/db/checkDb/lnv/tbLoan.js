/**
 * CheckLnvTbLoan - Helper class for verifying loan data in LNV database
 */

class CheckLnvTbLoan {
  checkLoanExists(customerId) {
    const query = `SELECT COUNT(*) as count FROM loan WHERE customer_id = '${customerId}'`;
    return cy.task('queryDbLNV', query).then((rows) => {
      expect(parseInt(rows[0].count)).to.be.greaterThan(0, `Loan should exist for customer: ${customerId}`);
      return rows;
    });
  }

  checkLoanStatus(loanId, expectedStatus) {
    const query = `SELECT status FROM loan WHERE id = '${loanId}'`;
    return cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.have.length.greaterThan(0, `Loan ${loanId} should exist`);
      expect(rows[0].status).to.eq(expectedStatus, `Loan status should be ${expectedStatus}`);
      return rows;
    });
  }

  checkLoanAmount(loanId, expectedAmount) {
    const query = `SELECT amount FROM loan WHERE id = '${loanId}'`;
    return cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.have.length.greaterThan(0);
      expect(parseFloat(rows[0].amount)).to.eq(expectedAmount);
      return rows;
    });
  }
}

export const onCheckLnvTbLoan = new CheckLnvTbLoan();
