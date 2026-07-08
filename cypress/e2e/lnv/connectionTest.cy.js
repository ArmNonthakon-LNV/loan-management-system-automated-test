describe('LNV Database Connection Tests (PostgreSQL)', () => {

  it('should connect to DB LNV and query successfully', () => {
    const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'lmsdb-pg-uat-01-matcha' LIMIT 5`;

    cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.be.an('array');
      cy.log('Tables found:', rows.length);
      rows.forEach((row, index) => {
        cy.log(`Table ${index}: ${row.table_name}`);
      });
    });
  });

  it('should verify LNV environment configuration', () => {
    cy.log('Environment:', Cypress.env('ENV_CONFIG'));
    cy.log('Endpoint:', Cypress.env('endPoint'));
    expect(Cypress.env('endPoint')).to.be.a('string');
  });

});
