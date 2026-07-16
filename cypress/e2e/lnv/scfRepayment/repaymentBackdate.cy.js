import { APIHelper } from '../../../support/common/apiHelper';

describe('SCF Backdate Repayment - Full Flow', () => {
  const api = new APIHelper();
  const endPoint = Cypress.env('endPoint');

  // Shared state across steps
  let makerToken;
  let checkerToken;
  let loanContractId;
  let loanAccountId;
  let customerId;
  let transactionId;
  let referenceLoanNo;
  let scfCreateReqBody;
  let testData; // loaded from fixture

  // Generate a random valid Thai National ID (13 digits with valid checksum)
  function generateThaiId() {
    const digits = [];
    for (let i = 0; i < 12; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 10;
    digits.push(checkDigit);
    return digits.join('');
  }

  // Helper to extract value from template string like "{{key value}}"
  function extractTemplateValue(templateStr) {
    if (typeof templateStr !== 'string') return templateStr;
    const match = templateStr.match(/\{\{.*?\s(.+?)\}\}/);
    return match ? match[1] : templateStr;
  }

  before(() => {
    expect(Cypress.env('makerUsername'), 'makerUsername env var').to.not.be.undefined;
    expect(Cypress.env('makerPassword'), 'makerPassword env var').to.not.be.undefined;
    expect(Cypress.env('checkerUsername'), 'checkerUsername env var').to.not.be.undefined;
    expect(Cypress.env('checkerPassword'), 'checkerPassword env var').to.not.be.undefined;

    // Load fixture once and store
    cy.fixture('lnv/scfRepayment/reqBody/bizLogic/scfDatatest.json').then((fixture) => {
      testData = fixture.data;
    });
  });

  // ============================================================
  // STEP 1: Create Drawdown TermLoan & Activate
  // ============================================================
  it('Step 1: Create Drawdown TermLoan & Activate', () => {
    expect(testData, 'Test data should be loaded').to.not.be.undefined;

    const timestamp = Date.now();
    const thaiId = generateThaiId();
    const createTermLoan = testData.CreateTermLoan;

    const createReqBody = {
      "transaction_owner_id": "API0002",
      "channel": "API",
      "product_id": 3,
      "sub_product_id": 3,
      "registration_id": thaiId,
      "tax_id": thaiId,
      "mobile_no": "0970734476",
      "email_address": "poovanad.mun@thinkerfint.com",
      "line_id": "_Pavin_",
      "landline_phone_no": "029282712",
      "landline_phone_no_ext": "001,099",
      "first_name_th": `ถูกหวย${timestamp}`,
      "last_name_th": `แสนล้าน${timestamp}`,
      "first_name_en": `tookhua${timestamp}`,
      "last_name_en": `Saenlan${timestamp}`,
      "customer_contract_age": 23,
      "title_id": 8,
      "date_of_birth": "03/02/2003",
      "gender_id": 2,
      "nationality_id": 1,
      "nationality_description": "nationality_description",
      "place_of_birth": "ชลบุรี",
      "marital_status_id": 2,
      "occupation_id": 13,
      "occupation_description": "occupation_description",
      "profession_id": 1,
      "profession_description": "ร้านโชห่วย",
      "business_code": "009010299",
      "biometric_type": "",
      "biometric_format": "",
      "biometric_data": "",
      "source_of_income_country_id": 1,
      "source_of_income_id": 1,
      "monthly_income": 100000.00,
      "other_income": 50000.00,
      "country_id": 1,
      "education_id": 3,
      "residential_id": 4,
      "customer_consent_no": "b4882238-65e6-472d-8c02-32a0c112a239",
      "customer_consent_time": "2024-10-15T07:00:51.793709Z",
      "contract_content_no": "3cb706b5-ae90-4c45-9208-41d0c3cf4ebd",
      "contract_content_data": "https://uat-apigw.lendocraft.com/uat/v1/dms/documents/file/3cb706b5-ae90-4c45-9208-41d0c3cf4ebd",
      "contract_signed_time": "2024-10-16T12:37:12Z",
      "contract_document_no": "6e313875-8ef8-4f14-a34b-97023fadc5bd",
      "contract_document_data": "https://uat-apigw.lendocraft.com/uat/v1/dms/documents/file/6e313875-8ef8-4f14-a34b-97023fadc5bd",
      "ip_id": "1",
      "customer_address": [
        {"address_type_id": 1, "province_id": 9, "district_id": 154, "sub_district_id": 971, "address_no": "872/ก21", "road": "สุขุมวิท333", "moo": "4", "trok": "โรงหมู", "soi": "พานทอง21ก", "village_name": "เสริมสุข", "building_name": "A", "floor_no": "31", "zip_code_id": 1003, "address_line1": "", "address_line2": ""},
        {"address_type_id": 2, "province_id": 9, "district_id": 154, "sub_district_id": 971, "address_no": "11/11", "road": "สุขุมวิท333", "moo": "4", "trok": "โรงหมู", "soi": "พานทอง21ก", "village_name": "เสริมสุข", "building_name": "B", "floor_no": "4", "zip_code_id": 1003, "address_line1": "", "address_line2": ""},
        {"address_type_id": 3, "province_id": 9, "district_id": 154, "sub_district_id": 971, "address_no": "118/90", "road": "สุขุมวิท333", "moo": "4", "trok": "โรงหมู", "soi": "พานทอง21ก", "village_name": "เสริมสุข", "building_name": "C", "floor_no": "18", "zip_code_id": 1003, "address_line1": "", "address_line2": ""}
      ],
      "customer_document": [
        {"document_type": "ID Card", "doucment_ref_no": "DCCIF1023948576", "document_country_id": 1, "document_issue_date": "25/01/2021", "document_expiry_date": "25/01/2025"}
      ],
      "customer_loan_account": {
        "address_type_id": 1,
        "bank_account_no": "6091000820",
        "bank_account_name": "นายถูกหวย แสนล้าน",
        "bank_account_bot_bank_code": "004",
        "bank_account_bot_bank_name": "ธนาคารกสิกรไทย",
        "enable_debit_bank_account": true,
        "contact_name": "นายถูกหวย แสนล้าน",
        "mobile_no": "0970734476",
        "email_address": "poovanad.mun@thinkerfint.com",
        "line_id": "_Pavin_",
        "landing_phone_no": "029282712-001",
        "loan_purpose_id": 1,
        "application_id": 999
      },
      "customer_credit_limit": [
        {"index_no": 1, "credit_limit_type": "Revolving", "limit_reference_id": 1, "reference_type": "Customer", "reference_id": "0", "parent_index": null, "level": 1, "supplier_branch_id": null, "currency_code": "THB", "original_limit_amount": 100000.00, "standard_interest_rate_type": "FIXED", "floating_interest_rate_type": "MRR", "floating_spread": 7.0, "fixed_interest_rate": 5.38271},
        {"index_no": 2, "credit_limit_type": "Non-Revolving", "limit_reference_id": 3, "reference_type": "Product", "reference_id": "3", "parent_index": 1, "level": 2, "supplier_branch_id": null, "currency_code": "THB", "original_limit_amount": 80000.00, "standard_interest_rate_type": "FIXED", "floating_interest_rate_type": "MRR", "floating_spread": 12.36432, "fixed_interest_rate": 1.36432},
        {"index_no": 3, "credit_limit_type": "Non-Revolving", "limit_reference_id": 4, "reference_type": "Sponsor", "reference_id": "3", "parent_index": 2, "level": 3, "supplier_branch_id": null, "currency_code": "THB", "original_limit_amount": 50000.00, "standard_interest_rate_type": "FIXED", "floating_interest_rate_type": "MRR", "floating_spread": 12.0, "fixed_interest_rate": 3.36432},
        {"index_no": 4, "credit_limit_type": "Non-Revolving", "limit_reference_id": 4, "reference_type": "Supplier", "reference_id": "90001104", "parent_index": 3, "level": 4, "supplier_branch_id": 3629, "currency_code": "THB", "original_limit_amount": 50000.00, "standard_interest_rate_type": "FIXED", "floating_interest_rate_type": "MRR", "floating_spread": 25.00000, "fixed_interest_rate": 18.7}
      ],
      "loan_samsung_detail": {
        "due_day": createTermLoan.due_day,
        "tenor_in_months": createTermLoan.tenor_in_months,
        "interest_per_year": createTermLoan.interest_per_year,
        "total_loan_amount": createTermLoan.total_loan_amount,
        "emi_amount": 4650.18,
        "total_item_count": 1,
        "total_item_price": createTermLoan.total_item_price,
        "total_down_payment": 0.00,
        "total_processing_fee": createTermLoan.total_processing_fee,
        "contact_date": createTermLoan.contact_date,
        "sourcing_program": "string",
        "line_items": [
          {"item_description": "Samsung Galaxy A55 8/128GB", "item_name": "Samsung Galaxy A55", "item_code": "SM-A556E128GB", "item_color": "Blue", "imei_number": "356938035643809", "serial_number": "SN1234567890", "product_type": "smartphone", "item_price": 40000.00, "item_down_payment": 10000.00, "item_loan_amount": 30000.00, "item_type": "device"},
          {"item_description": "2Samsung Galaxy A55 8/128GB", "item_name": "2Samsung Galaxy A55", "item_code": "2SM-A556E128GB", "item_color": "2Blue", "imei_number": "2356938035643809", "serial_number": "2SN1234567890", "product_type": "accessory", "item_price": 15000.00, "item_down_payment": 0.00, "item_loan_amount": 15000.00, "item_type": "accessory"},
          {"item_description": "3Samsung Galaxy A55 8/128GB", "item_name": "3Samsung Galaxy A55", "item_code": "3SM-A556E128GB", "item_color": "3Blue", "imei_number": "3356938035643809", "serial_number": "3SN1234567890", "product_type": "warranty", "item_price": 5000.00, "item_down_payment": 0.00, "item_loan_amount": 5000.00, "item_type": "warranty"}
        ]
      }
    };

    cy.log('Step 1a: Create Drawdown TermLoan');
    cy.log('Request:', JSON.stringify(createReqBody));

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/customer/term-loan/create`)
      .setReqHeaders()
      .setReqBody(createReqBody)
      .sendRequest('createDrawdownResponse');

    cy.get('@createDrawdownResponse').then((res) => {
      cy.log('Create Drawdown Response:', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);

      cy.log('TermLoan created successfully');

      // Step 1b: Activate TermLoan
      cy.log('Step 1b: Activate TermLoan');

      const activateBody = {
        "transaction_owner_id": "API0001",
        "channel": "API",
        "customer_id": res.body.data.customer_id,
        "loan_account_id": res.body.data.loan_account_id,
        "limit_effective_date": "11/12/2025",
        "limit_expiry_date": "11/12/2028"
      };

      api
        .setReqMethod('POST')
        .setReqEndpoint(`${endPoint}/api/customer/term-loan/activate`)
        .setReqHeaders()
        .setReqBody(activateBody)
        .sendRequest('activateResponse');

      cy.get('@activateResponse').then((activateRes) => {
        cy.log('Activate Response:', JSON.stringify(activateRes.body));
        expect(activateRes.status).to.eq(200);
        expect(activateRes.body.response_code).to.eq(0);

        // Get loan_contract_id, loan_account_id, customer_id from activate response
        loanContractId = activateRes.body.data.loan_contract_id;
        loanAccountId = activateRes.body.data.loan_account_id;
        customerId = activateRes.body.data.customer_id;

        cy.log('Customer ID:', customerId);
        cy.log('Loan Account ID:', loanAccountId);
        cy.log('Loan Contract ID:', loanContractId);
        cy.log('TermLoan created and activated successfully');

        // Step 1c: Update effective_date in loan_contract_no table
        const contractDate = testData.CreateTermLoan.contact_date.replace('T', ' ').replace('+07:00', '');
        const updateQuery = `UPDATE loan_contract_no SET effective_date='${contractDate}' WHERE loan_contract_id = '${loanContractId}'`;
        cy.log('Update DB Query:', updateQuery);

        cy.task('queryDbLNV', updateQuery).then((result) => {
          cy.log('DB Update Result:', JSON.stringify(result));
          cy.log('loan_contract_no effective_date updated successfully');
        });
      });
    });
  });

  

  // ============================================================
  // STEP 2: Calculate Interest & Repayment (loop through CalIntAndRepay array)
  // ============================================================
  it('Step 2: Calculate Interest & Repayment', () => {
    expect(loanContractId, 'Loan Contract ID should be available').to.not.be.undefined;

    const calIntAndRepay = testData.CalIntAndRepay || [];

    // Process entries strictly sequentially using cy.then() chain
    function processEntry(index) {
      if (index >= calIntAndRepay.length) return; // done

      const entry = calIntAndRepay[index];

      // CalInterest
      if (entry.CalInterest) {
        cy.log(`[Entry ${index + 1}] Calculate Interest`);

        const calReqBody = {
          loan_contract_id: loanContractId,
          calculate_start_date: extractTemplateValue(entry.CalInterest.reqBody.calculate_start_date),
          calculate_end_date: extractTemplateValue(entry.CalInterest.reqBody.calculate_end_date)
        };

        cy.log('Cal Interest Request:', JSON.stringify(calReqBody));

        api
          .setReqMethod('POST')
          .setReqEndpoint(`${endPoint}/api/term-loan/test-interest-cal`)
          .setReqHeadersWithAuth('en_US', makerToken)
          .setReqBody(calReqBody)
          .sendRequest(`calInterest_${index}`);

        cy.get(`@calInterest_${index}`).then((res) => {
          cy.log(`[Entry ${index + 1}] Cal Interest Response:`, JSON.stringify(res.body));
          expect(res.status).to.eq(200);
          expect(res.body.response_code).to.eq(0);
        });

        // Wait 30 sec for background calculation to complete
        cy.wait(30000);

        // Verify interest calculation in DB
        if (entry.CalInterest.expect_result) {
          const expectedPeriod = entry.CalInterest.expect_result.Period;
          const expectedBfInterest = entry.CalInterest.expect_result.bf_interest;
          const expectedDay = entry.CalInterest.expect_result.day;

          const query = `SELECT i.bf_interest, i.day FROM installment_balance i WHERE i.period = ${expectedPeriod} AND i.loan_contract_id = '${loanContractId}'`;
          cy.log('Verify Interest Query:', query);

          cy.task('queryDbLNV', query).then((rows) => {
            expect(rows).to.be.an('array');
            expect(rows.length).to.be.greaterThan(0, 'Should find installment_balance record');

            const row = rows[0];
            cy.log('DB Interest Record:', JSON.stringify(row));

            expect(parseFloat(row.bf_interest)).to.be.closeTo(expectedBfInterest, 0.01,
              `bf_interest should match expected ${expectedBfInterest}`);
            expect(parseInt(row.day)).to.eq(expectedDay,
              `day should match expected ${expectedDay}`);

            cy.log(`[Entry ${index + 1}] Interest verification passed ✓`);
          });
        }

        // Then move to next entry
        cy.then(() => processEntry(index + 1));
      }
      // Repayment
      else if (entry.Repayment) {
        cy.log(`[Entry ${index + 1}] Create & Confirm Repayment`);

        const repaymentAmount = entry.Repayment.reqBody.repayment_amount;
        const repaymentDate = entry.Repayment.reqBody.repayment_date;
        const paymentDate = repaymentDate.replace('T', ' ').replace(/\+.*$/, '');

        const repayReqBody = {
          transaction_owner_id: "API0002",
          channel: "API",
          customer_id: customerId,
          loan_account_id: loanAccountId,
          loan_contract_id: loanContractId,
          request_amount: repaymentAmount
        };

        cy.log('Create Repayment Request:', JSON.stringify(repayReqBody));

        api
          .setReqMethod('POST')
          .setReqEndpoint(`${endPoint}/api/repayment/term-loan/create`)
          .setReqHeaders()
          .setReqBody(repayReqBody)
          .sendRequest(`createRepay_${index}`);

        cy.get(`@createRepay_${index}`).then((repayRes) => {
          cy.log(`[Entry ${index + 1}] Create Repayment Response:`, JSON.stringify(repayRes.body));
          expect(repayRes.status).to.eq(200);
          expect(repayRes.body.response_code).to.eq(0);

          const repayOrderId = repayRes.body.data.order_no;

          // Confirm Repayment
          const confirmBody = {
            order_id: repayOrderId,
            invoice_no: repayOrderId,
            payment_amount: repaymentAmount,
            payment_date: paymentDate,
            payment_channel: "ThaiQR"
          };

          api
            .setReqMethod('POST')
            .setReqEndpoint(`${endPoint}/api/repayment/term-loan/test-confirm`)
            .setReqHeadersWithAuth('en_US', makerToken)
            .setReqBody(confirmBody)
            .sendRequest(`confirmRepay_${index}`);

          cy.get(`@confirmRepay_${index}`).then((confirmRes) => {
            cy.log(`[Entry ${index + 1}] Confirm Response:`, JSON.stringify(confirmRes.body));
            expect(confirmRes.status).to.eq(200);
            expect(confirmRes.body.response_code).to.eq(0);
          });
        });

        // Then move to next entry after confirm completes
        cy.then(() => processEntry(index + 1));
      }
    }

    // Start processing from first entry
    processEntry(0);
  });

  // ============================================================
  // STEP 3: Maker Login
  // ============================================================
  it('Step 3: Maker Login', () => {
    const reqBody = {
      username: Cypress.env('makerUsername'),
      password: Cypress.env('makerPassword')
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/login`)
      .setReqHeaders()
      .setReqBody(reqBody)
      .sendRequest('makerLoginResponse');

    cy.get('@makerLoginResponse').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      expect(res.body.data.jwt_token).to.be.a('string').and.not.be.empty;
      makerToken = res.body.data.jwt_token;
      cy.log('Maker login successful');
    });
  });

  // ============================================================
  // STEP 4: SCF Backdate Calculate
  // ============================================================
  it('Step 4: SCF Backdate Calculate', () => {
    expect(makerToken, 'Maker token should be available').to.not.be.undefined;
    expect(loanContractId, 'Loan Contract ID should be available').to.not.be.undefined;

    const scfData = testData.SCF;
    const calcReqBody = {
      channel: "WEB",
      transaction_owner_id: "100",
      effective_date: scfData.effective_date,
      loan_contract_id: loanContractId,
      calculation_period: 1,
      need_close_account: false,
      repayment_amount: scfData.repayment_amount
    };

    cy.log('SCF Calculate Request:', JSON.stringify(calcReqBody));

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/repayment/simple-cash-flow/backdate-calculate`)
      .setReqHeadersWithAuth('en_US', makerToken)
      .setReqBody(calcReqBody)
      .sendRequest('scfCalcResponse');

    cy.get('@scfCalcResponse').then((res) => {
      cy.log('SCF Calculate Response:', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      expect(res.body.data).to.have.property('principle_balance');
      expect(res.body.data).to.have.property('effective_date_calculation');

      // Store repayment breakdown from effective_date_calculation for Step 5
      const calcData = res.body.data.effective_date_calculation;
      scfCreateReqBody = {
        interest_amount: parseFloat(calcData.interest_amount) || 0,
        loan_amount: parseFloat(calcData.loan_amount) || 0,
        late_charge_amount: parseFloat(calcData.late_charge_amount) || 0,
        fee_amt: parseFloat(calcData.fee_amt) || 0,
        total_amount: parseFloat(calcData.total_amount) || 0,
        pay_off_amount: parseFloat(res.body.data.pay_off_amount) || 0
      };

      cy.log('Repayment breakdown:', JSON.stringify(scfCreateReqBody));
    });
  });

  // ============================================================
  // STEP 5: SCF Create
  // ============================================================
  it('Step 5: SCF Create', () => {
    expect(makerToken, 'Maker token should be available').to.not.be.undefined;
    expect(scfCreateReqBody, 'SCF calculate data should be available').to.not.be.undefined;

    const scfData = testData.SCF;
    const reqBody = {
      transaction_owner_id: "100",
      channel: "WEB",
      customer_id: customerId,
      loan_account_id: loanAccountId,
      loan_contract_id: loanContractId,
      payment_method_id: 101,
      repayment_method: "21",
      business_event_id: 11,
      effective_date: scfData.effective_date,
      principle_amt: scfCreateReqBody.loan_amount,
      accrued_int_amt_before_due_date: scfCreateReqBody.interest_amount,
      accrued_int_amt_after_due_date: 0,
      penalty_int_amt: scfCreateReqBody.late_charge_amount,
      fee_amt: scfCreateReqBody.fee_amt,
      enable_slip: true,
      is_notify: false,
      memo: "TEST",
      input_option: "auto",
      need_close_account: true,
      repayment_amount: scfData.repayment_amount,
      period: 1,
      transaction_eff_date: scfData.current_eff_date
    };

    cy.log('SCF Create Request:', JSON.stringify(reqBody));

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/repayment/simple-cash-flow/create`)
      .setReqHeadersWithAuth('en_US', makerToken)
      .setReqBody(reqBody)
      .sendRequest('scfCreateResponse');

    cy.get('@scfCreateResponse').then((res) => {
      cy.log('SCF Create Response:', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);

      transactionId = res.body.data.transaction_id;
      referenceLoanNo = res.body.data.reference_loan_no;
      cy.log('Transaction ID:', transactionId);
      cy.log('Reference Loan No:', referenceLoanNo);
    });
  });

  // ============================================================
  // STEP 6: SCF Submit
  // ============================================================
  it('Step 6: SCF Submit', () => {
    expect(transactionId, 'Transaction ID should be available').to.not.be.undefined;

    const reqBody = {
      channel: 'WEB',
      transaction_owner_id: '331',
      transaction_id: Number(transactionId)
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/repayment/simple-cash-flow/submit`)
      .setReqHeadersWithAuth('en_US', makerToken)
      .setReqBody(reqBody)
      .sendRequest('scfSubmitResponse');

    cy.get('@scfSubmitResponse').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      cy.log('SCF submitted successfully');
    });
  });

  // ============================================================
  // STEP 7: Checker Login
  // ============================================================
  it('Step 7: Checker Login', () => {
    expect(Cypress.env('makerUsername')).to.not.eq(Cypress.env('checkerUsername'),
      'Maker and Checker must be different users');

    const reqBody = {
      username: Cypress.env('checkerUsername'),
      password: Cypress.env('checkerPassword')
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/login`)
      .setReqHeaders()
      .setReqBody(reqBody)
      .sendRequest('checkerLoginResponse');

    cy.get('@checkerLoginResponse').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      expect(res.body.data.jwt_token).to.be.a('string').and.not.be.empty;
      checkerToken = res.body.data.jwt_token;
      cy.log('Checker login successful');
    });
  });

  // ============================================================
  // STEP 8: Check Transaction Detail
  // ============================================================
  it('Step 8: Check Transaction Detail', () => {
    expect(checkerToken, 'Checker token should be available').to.not.be.undefined;
    expect(transactionId, 'Transaction ID should be available').to.not.be.undefined;

    const reqBody = {
      channel: 'WEB',
      transaction_owner_id: '238',
      transaction_id: Number(transactionId),
      reference_loan_no: referenceLoanNo
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/repayment/transaction/search/detail`)
      .setReqHeadersWithAuth('en_US', checkerToken)
      .setReqBody(reqBody)
      .sendRequest('checkDetailResponse');

    cy.get('@checkDetailResponse').then((res) => {
      cy.log('Check Detail Response:', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      cy.log('Transaction detail verified');
    });
  });

  // ============================================================
  // STEP 9: SCF Approve
  // ============================================================
  it('Step 9: SCF Approve', () => {
    expect(checkerToken, 'Checker token should be available').to.not.be.undefined;
    expect(transactionId, 'Transaction ID should be available').to.not.be.undefined;
    expect(referenceLoanNo, 'Reference Loan No should be available').to.not.be.undefined;

    const scfData = testData.SCF;
    const reqBody = {
      channel: 'WEB',
      transaction_owner_id: '238',
      transaction_id: Number(transactionId),
      reference_loan_no: referenceLoanNo,
      eff_date: scfData.current_eff_date
    };

    api
      .setReqMethod('POST')
      .setReqEndpoint(`${endPoint}/api/repayment/simple-cash-flow/approved`)
      .setReqHeadersWithAuth('en_US', checkerToken)
      .setReqBody(reqBody)
      .sendRequest('scfApproveResponse');

    cy.get('@scfApproveResponse').then((res) => {
      cy.log('SCF Approve Response:', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body.response_code).to.eq(0);
      cy.log('SCF APPROVED successfully ✓');
    });
  });

  // ============================================================
  // STEP 10: Verify Installment Balance in Database
  // ============================================================
  it('Step 10: Verify Installment Balance Data', () => {
    expect(loanContractId, 'Loan Contract ID should be available').to.not.be.undefined;

    const expectedResults = testData.SCF.expect_result;
    expect(expectedResults, 'expect_result should be defined').to.be.an('array').and.not.be.empty;

    const query = `SELECT i.period, i.contract_emi, i.bf_interest, i.bf_principal, i.cf_principal_balance, i.display_interest_until_due_date, i.display_principal_until_due_date FROM installment_balance i WHERE i.loan_contract_id = '${loanContractId}' AND period <> 0 ORDER BY period`;
    cy.log('Installment Balance Query:', query);

    cy.task('queryDbLNV', query).then((rows) => {
      expect(rows).to.be.an('array');
      expect(rows.length).to.eq(expectedResults.length, `Should have ${expectedResults.length} periods`);

      expectedResults.forEach((expected) => {
        const row = rows.find(r => parseInt(r.period) === expected.Period);
        expect(row, `Period ${expected.Period} should exist in DB`).to.not.be.undefined;

        cy.log(`--- Period ${expected.Period} ---`);

        // contract_emi
        expect(parseFloat(row.contract_emi)).to.be.closeTo(expected.contract_emi, 0.01,
          `Period ${expected.Period}: contract_emi mismatch`);

        // bf_interest
        expect(parseFloat(row.bf_interest)).to.be.closeTo(expected.bf_interest, 0.01,
          `Period ${expected.Period}: bf_interest mismatch`);

        // bf_principal
        expect(parseFloat(row.bf_principal)).to.be.closeTo(expected.bf_principal, 0.01,
          `Period ${expected.Period}: bf_principal mismatch`);

        // cf_principal_balance
        expect(parseFloat(row.cf_principal_balance)).to.be.closeTo(expected.cf_pricipal_balance, 0.01,
          `Period ${expected.Period}: cf_principal_balance mismatch`);

        // display_interest_until_due_date
        expect(parseFloat(row.display_interest_until_due_date)).to.be.closeTo(expected.display_interst, 0.01,
          `Period ${expected.Period}: display_interest mismatch`);

        // display_principal_until_due_date
        expect(parseFloat(row.display_principal_until_due_date)).to.be.closeTo(expected.display_principal, 0.01,
          `Period ${expected.Period}: display_principal mismatch`);

        cy.log(`Period ${expected.Period}: ✓ All values match`);
      });

      cy.log('All installment balance periods verified successfully ✓');
    });
  });
});
