describe('Database Connection Tests', () => {
    beforeEach(() => {
    })
    
    it('should verify Cypress is working', () => {
      cy.visit('https://example.cypress.io')
      cy.url().should('include', 'cypress.io')
    })
  
    it('should connect to DB T2P (port 3306)', () => {
      const query = `SELECT * FROM ibaht.Card where vBarcode in ('620200028515','620100000289') LIMIT 2`;
      
      cy.task('queryDbT2P', query).then((rows) => {
        expect(rows).to.be.an('array');
        expect(rows.length).to.be.greaterThan(0);
        
        if (rows[0]) {
          cy.log('Barcode0=========== >>>> ', rows[0].vBarCode);
          cy.log('Apptype0=========== >>>> ', rows[0].vAppType);
        }
        
        if (rows[1]) {
          cy.log('Barcode1=========== >>>> ', rows[1].vBarCode);
          cy.log('Apptype1=========== >>>> ', rows[1].vAppType);
        }
      });
    }).timeout(10000);
  
    it('should connect to DB KBANK (port 3306)', () => {
      const query = `SELECT * FROM ibaht.Card where vBarcode ='100100800197' LIMIT 1`;
      
      cy.task('queryDbKbank', query).then((rows) => {
        expect(rows).to.be.an('array');
        expect(rows.length).to.be.greaterThan(0);
        
        if (rows[0]) {
          cy.log('Barcode0=========== >>>> ', rows[0].vBarCode);
          cy.log('Apptype0=========== >>>> ', rows[0].vAppType);
        }
      });
    }).timeout(10000);
  
    it('should verify environment configuration', () => {
      cy.log('Environment:', Cypress.env('env'));
      cy.log('Endpoint:', Cypress.env('endPoint'));
      expect(Cypress.env('endPoint')).to.be.a('string');
    });
  })
  
