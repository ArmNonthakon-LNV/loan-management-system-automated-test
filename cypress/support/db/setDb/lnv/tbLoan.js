/**
 * SetLnvTbLoan - Helper class for setting/updating loan data in LNV database
 * ใช้สำหรับ pre-condition ก่อนรันเทสต์
 */

class SetLnvTbLoan {
  updateLoanStatus(loanId, newStatus) {
    const query = `UPDATE loan SET status = '${newStatus}', updated_at = NOW() WHERE id = '${loanId}'`;
    return cy.task('queryDbLNV', query);
  }

  resetLoanForTest(loanId, originalStatus) {
    const query = `UPDATE loan SET status = '${originalStatus}', updated_at = NOW() WHERE id = '${loanId}'`;
    return cy.task('queryDbLNV', query);
  }
}

export const onSetLnvTbLoan = new SetLnvTbLoan();
