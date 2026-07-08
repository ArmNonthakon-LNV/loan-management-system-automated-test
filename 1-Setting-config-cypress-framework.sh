#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   ./seting-config-cypress-framework.sh [TARGET_DIRECTORY]
# If TARGET_DIRECTORY is not provided, the current directory is used.
#
# สคริปต์นี้จะสร้าง "ตัวอย่าง config" และ helper ต่าง ๆ
# ให้โปรเจกต์เป้าหมาย ตาม template จากโปรเจกต์นี้

TARGET_DIR="${1:-$(pwd)}"
CYPRESS_DIR="$TARGET_DIR/cypress"

echo "Applying sample Cypress configuration into: $CYPRESS_DIR"

mkdir -p "$CYPRESS_DIR/config"
mkdir -p "$CYPRESS_DIR/e2e"
mkdir -p "$CYPRESS_DIR/support/common"
mkdir -p "$CYPRESS_DIR/support"
mkdir -p "$CYPRESS_DIR/support/db/checkDb/iBaht"
mkdir -p "$CYPRESS_DIR/support/db/getDb/iBaht"
mkdir -p "$CYPRESS_DIR/support/db/setDb/iBaht"

cat > "$CYPRESS_DIR/config/test.json" << 'EOF'
{
    "env": {
      "endPoint": "https://test-apigw.t2pco.com",
      "env": "test",
      "endpoints": {
        "initiation": "https://test-apigw.t2pco.com/test/whitelist/v1/bay-bill-payment/transaction/initiation",
        "confirmation": "https://test-apigw.t2pco.com/test/whitelist/v1/bay-bill-payment/transaction/confirmation"
      }
    }
  }
  
EOF

cat > "$CYPRESS_DIR/e2e/spec.cy.js" << 'EOF'
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
  
EOF

cat > "$CYPRESS_DIR/support/common/apiHelper.js" << 'EOF'
/**
 * APIHelper - Utility class for managing HTTP requests in Cypress tests
 * Uses Builder Pattern for clean request configuration
 */

export class APIHelper {
    constructor() {
        this.requestConfig = {
            method: null,
            url: null,
            body: null,
            headers: null
        }
    }

    setReqMethod(myMethod) {
        this.requestConfig.method = myMethod
        return this
    }

    setReqEndpoint(myEndpoint) {
        this.requestConfig.url = myEndpoint
        return this
    }

    setReqBody(myBody) {
        this.requestConfig.body = myBody
        return this
    }

    setReqHeaders(myLang = 'en_US') {
        const headers = {
            'Content-Type': 'application/json',
            'Accept-Language': myLang
        }
        cy.wrap(headers).as('header')
        this.requestConfig.headers = headers
        return this
    }

    setReqHeadersWithAuth(myLang = 'en_US', accessToken = null) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept-Language': myLang
        }
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }
        
        cy.wrap(headers).as('header')
        this.requestConfig.headers = headers
        return this
    }

    setReqHeadersWithApiKey(apiKey, lang = 'en_US') {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'API-Key': apiKey,
            'Accept-Language': lang
        }
        cy.wrap(headers).as('header')
        this.requestConfig.headers = headers
        return this
    }

    sendRequest(myAlias) {
        cy.get('@header').then((headers) => {
            const requestOptions = {
                method: this.requestConfig.method,
                url: this.requestConfig.url,
                headers: headers,
                body: this.requestConfig.body,
                timeout: 90000,
                failOnStatusCode: false
            }
            cy.request(requestOptions).as(myAlias)
        })
        return this
    }
}

// Export singleton instance
export const apiHelper = new APIHelper()
EOF

cat > "$CYPRESS_DIR/support/db/checkDb/iBaht/tbCard.js" << 'EOF'
/**
 * Database Check Helper: iBaht Table Card
 * Pattern: CheckiBahtTbCard
 *
 * Folder  : cypress/support/checkDB/iBaht/
 * File    : tbCard.js
 *
 * Usage:
 * import { onCheckiBahtTbCard } from "../../../support/checkDB/iBaht/tbCard"
 * onCheckiBahtTbCard.checkCard(vBarcode)
 */

export class CheckiBahtTbCard {
    checkCard(vBarcode) {
        const query = `SELECT * FROM ibaht.Card WHERE vBarcode = '${vBarcode}' LIMIT 1`
        cy.task('queryDbT2P', query).then((rows) => {
            const row = rows && rows.length > 0 ? rows[0] : null
            cy.wrap(row).as('cardCheckResult')
        })
    }

    checkCardsInList(vBarcodes) {
        const barcodes = vBarcodes.map(code => `'${code}'`).join(',')
        const query = `SELECT * FROM ibaht.Card WHERE vBarcode IN (${barcodes})`
        cy.task('queryDbT2P', query).then((rows) => {
            cy.wrap(rows || []).as('cardsCheckResult')
        })
    }
}

export const onCheckiBahtTbCard = new CheckiBahtTbCard()
EOF

cat > "$CYPRESS_DIR/support/db/getDb/iBaht/tbCard.js" << 'EOF'
/**
 * Database Get Helper: iBaht Table Card
 * Pattern: Get<dbName>Tb<table>
 * 
 * Usage:
 * import { onGetiBahtTbCard } from "../../../support/getDB/ibahtTbCard"
 * onGetiBahtTbCard.getCard(vBarcode)
 */

export class GetiBahtTbCard {
    getCard(vBarcode) {
        const query = `SELECT * FROM ibaht.Card WHERE vBarcode = '${vBarcode}' LIMIT 1`
        cy.task('queryDbT2P', query).then((rows) => {
            const row = rows && rows.length > 0 ? rows[0] : null
            cy.wrap(row).as('card')
        })
    }

    getCardsByAppType(vAppType) {
        const query = `SELECT * FROM ibaht.Card WHERE vAppType = '${vAppType}'`
        cy.task('queryDbT2P', query).then((rows) => {
            cy.wrap(rows || []).as('cardsByAppType')
        })
    }
}

export const onGetiBahtTbCard = new GetiBahtTbCard()
EOF

cat > "$CYPRESS_DIR/support/db/setDb/iBaht/tbCard.js" << 'EOF'
/**
 * Database Set Helper: iBaht Table Card
 * Pattern: Set<dbName>Tb<table>
 * 
 * Usage:
 * import { onSetiBahtTbCard } from "../../../support/setDB/ibahtTbCard"
 * onSetiBahtTbCard.updateCardStatus(vBarcode, status)
 */

export class SetiBahtTbCard {
    updateCardStatus(vBarcode, status) {
        const query = `UPDATE ibaht.Card SET vStatus = '${status}' WHERE vBarcode = '${vBarcode}'`
        cy.task('queryDbT2P', query).then(result => {
            cy.wrap(result).as('updateCardStatusResult')
        })
    }

    updateCard(vBarcode, updateData) {
        const setClause = Object.entries(updateData)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(', ')
        const query = `UPDATE ibaht.Card SET ${setClause} WHERE vBarcode = '${vBarcode}'`
        cy.task('queryDbT2P', query).then(result => {
            cy.wrap(result).as('updateCardResult')
        })
    }

    setCardCashRemainToZero(barcode) {
        const query = `UPDATE ibaht.Card SET nCashRemain = 0 where vBarcode = '${barcode}'`
        cy.task('queryDbT2P', query).then(result => {
            cy.wrap(result).as('setCardCashRemainToZeroResult')
        })
    }

    setCardToInactive(barcode) {
        const query = `UPDATE ibaht.Card SET cIsActive = 'N' where vBarcode = '${barcode}'`
        cy.task('queryDbT2P', query).then(result => {
            cy.wrap(result).as('setCardToInactiveResult')
        })
    }
}

export const onSetiBahtTbCard = new SetiBahtTbCard()
EOF

cat > "$CYPRESS_DIR/.gitignore" << 'EOF'
# These are some examples of commonly ignored file patterns.
# You should customize this list as applicable to your project.
# Learn more about .gitignore:
#     https://www.atlassian.com/git/tutorials/saving-changes/gitignore

# Node artifact files
node_modules/
dist/

# Compiled Java class files
*.class

# Compiled Python bytecode
*.py[cod]

# Log files
*.log

# Package files
*.jar

# Maven
target/
dist/

# JetBrains IDE
.idea/

# Unit test reports
TEST*.xml
report/

# Generated by MacOS
.DS_Store

# Generated by Windows
Thumbs.db

# Applications
*.app
*.exe
*.war

# Large media files
*.mp4
*.tiff
*.avi
*.flv
*.mov
*.wmv

# Cypress
cypress/videos/
cypress/screenshots/
cypress/downloads/

# Environment variables (Credentials) - IMPORTANT!
.env
.env.local
.env.*.local
.env.*.local

# Config files with credentials
cypress/config/*.json
EOF

cat > "$CYPRESS_DIR/support/e2e.js" << 'EOF'
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Custom command for recording validation evidents to Excel via task
Cypress.Commands.add('recordEvident', (payload = {}) => {
  const currentTest = Cypress.currentTest || {};
  const testTitle = payload.testTitle || currentTest.title || '';
  const testDate = new Date().toISOString();
  const testedBy = Cypress.env('testedBy') || Cypress.env('TESTED_BY') || '';

  const finalPayload = {
    ...payload,
    testTitle,
    testDate,
    testedBy,
  };

  return cy.task('appendToValidationErrorReport', finalPayload);
});

// Automatically record an evident row after each test using its status and title
afterEach(function () {
  const test = this.currentTest || {};
  const state = (test.state || '').toLowerCase();

  let status = 'NORUN';
  if (state === 'passed') {
    status = 'PASSED';
  } else if (state === 'failed') {
    status = 'FAILED';
  }

  // พยายามดึง Test Case ID จากชื่อเทสต์ถ้ามีรูปแบบ [TC-XXXX] ที่หัวข้อ
  const title = test.title || '';
  const idMatch = title.match(/^\[(TC-[^\]]+)\]/i);
  const testCaseId = idMatch ? idMatch[1] : '';

  cy.recordEvident({
    status,
    testCaseId,
  });
});
EOF

cat > "$TARGET_DIR/cypress.config.js" << 'EOF'
const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();
const { recordTestEvident } = require('./cypress/tools/recordTestEvident');

module.exports = defineConfig({
  // Global timeouts (ลดการใส่ .timeout(...) ในแต่ละ test)
  // - requestTimeout/responseTimeout: เหมาะกับ API tests ที่บางครั้งใช้เวลานาน
  // - defaultCommandTimeout: เวลา retry ของคำสั่งอย่าง cy.get/cy.contains (ไม่ควรตั้งสูงเกินจำเป็น)
  defaultCommandTimeout: 10000,
  requestTimeout: 90000,
  responseTimeout: 90000,
  e2e: {
    setupNodeEvents(on, config) {
      const ENV_CONFIG = config.env.configFile || process.env.ENV || "test";
      
      // อ่าน config จาก file (ไม่มี credentials database)
      var configure = getConfigurationByFile(ENV_CONFIG);

      // ใช้ ENV ในการเลือก suffix สำหรับตัวแปร .env (เช่น TEST, DEV)
      const envSuffix = ENV_CONFIG.toUpperCase();

      // ตรวจสอบว่า Database credentials ใน process.env มีครบถ้วนสำหรับ ENV นี้
      const dbT2pConfig = getT2pDbConfig(envSuffix);
      const dbKbankConfig = getKbankDbConfig(envSuffix);

      if (!dbT2pConfig.host || !dbT2pConfig.user || !dbT2pConfig.password) {
        throw new Error(`Missing DB_T2P credentials in .env for environment: ${ENV_CONFIG}. Please set DB_T2P_HOST_${envSuffix}, DB_T2P_USER_${envSuffix}, DB_T2P_PASSWORD_${envSuffix} in .env file.`);
      }

      if (!dbKbankConfig.host || !dbKbankConfig.user || !dbKbankConfig.password) {
        throw new Error(`Missing DB_KBANK credentials in .env for environment: ${ENV_CONFIG}. Please set DB_KBANK_HOST_${envSuffix}, DB_KBANK_USER_${envSuffix}, DB_KBANK_PASSWORD_${envSuffix} in .env file.`);
      }

      // อ่าน endpoint และ testedBy จาก .env หรือ config file (non-credentials)
      const endpoint = process.env[`ENDPOINT_${envSuffix}`] || process.env.ENDPOINT || configure.env?.endPoint;
      const testedBy = process.env.TESTED_BY || '';

      // รวม configuration: config file (non-credentials) + .env (non-credential env)
      configure.env = {
        ...configure.env,
        ENV_CONFIG,
        ENV_SUFFIX: envSuffix,
        endPoint: endpoint,
        testedBy: testedBy
      };

      config = { ...config, ...configure };

      // สร้าง Excel reporter สำหรับบันทึกผล validation ลงไฟล์ evident-*.xlsx
      const excelReporter = recordTestEvident({
        reportDir: path.join(process.cwd(), 'cypress', 'reports', 'evidents'),
      });

      // Reset version tracking เมื่อเริ่ม run ใหม่
      on('before:run', () => {
        excelReporter.reset();
      });

      on('task', {
        queryDbKbank(query) {
          return dbKbank(query, config)
        },
        queryDbT2P(query) {
          return dbT2p(query, config)
        },
        appendToValidationErrorReport(payload) {
          if (!payload || typeof payload.testTitle !== 'string') return null;
          excelReporter.append(payload);
          return null
        }
      })
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: "other/path/to/**/*.js",
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: false,
    // Report generate (mochawesome)
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },
    video: true,
    videoUploadOnPasses: true,
    videosFolder: 'cypress/results',
  }
});
function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress", "config", `${file}.json`);
  if (!fs.existsSync(pathToConfigFile)) {
    return {};
  }
  return fs.readJSONSync(pathToConfigFile);
}

function getT2pDbConfig(envSuffix) {
  return {
    host: process.env[`DB_T2P_HOST_${envSuffix}`] || process.env.DB_T2P_HOST,
    user: process.env[`DB_T2P_USER_${envSuffix}`] || process.env.DB_T2P_USER,
    password: process.env[`DB_T2P_PASSWORD_${envSuffix}`] || process.env.DB_T2P_PASSWORD,
    port: parseInt(process.env[`DB_T2P_PORT_${envSuffix}`] || process.env.DB_T2P_PORT) || 3306
  };
}

function getKbankDbConfig(envSuffix) {
  return {
    host: process.env[`DB_KBANK_HOST_${envSuffix}`] || process.env.DB_KBANK_HOST,
    user: process.env[`DB_KBANK_USER_${envSuffix}`] || process.env.DB_KBANK_USER,
    password: process.env[`DB_KBANK_PASSWORD_${envSuffix}`] || process.env.DB_KBANK_PASSWORD,
    port: parseInt(process.env[`DB_KBANK_PORT_${envSuffix}`] || process.env.DB_KBANK_PORT) || 3306
  };
}

function dbT2p(query, config) {
  const envSuffix = (config && config.env && config.env.ENV_SUFFIX) || (process.env.ENV || 'test').toUpperCase();
  const connection = mysql.createConnection(getT2pDbConfig(envSuffix));
  // start connection to db
  connection.connect();
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        connection.end();
        reject(error)
      }
      else {
        // when execute sql success
        connection.end();
        // console.log(results)
        return resolve(results);
      }
    });
  });
}

function dbKbank(query, config) {
  const envSuffix = (config && config.env && config.env.ENV_SUFFIX) || (process.env.ENV || 'test').toUpperCase();
  const connection = mysql.createConnection(getKbankDbConfig(envSuffix));
  // start connection to db
  connection.connect();
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        connection.end();
        reject(error)
      }
      else {
        // when execute sql success
        connection.end();
        // console.log(results)
        return resolve(results);
      }
    });
  });
}
EOF

cat > "$TARGET_DIR/.env" << 'EOF'
# .env (Template file - safe for committing)
# คัดลอกไฟล์นี้เป็น .env และใส่ค่าจริงตาม environment ของแต่ละโปรเจกต์

ENV=test
ENDPOINT=https://your-endpoint.example.com

# DB T2P
DB_T2P_HOST=your-t2p-db-host
DB_T2P_USER=your-t2p-db-user
DB_T2P_PASSWORD=your-t2p-db-password
DB_T2P_PORT=3306

# DB KBANK
DB_KBANK_HOST=your-kbank-db-host
DB_KBANK_USER=your-kbank-db-user
DB_KBANK_PASSWORD=your-kbank-db-password
DB_KBANK_PORT=3306

# Test Reporter
TESTED_BY="Your Name"
EOF

echo "Sample Cypress configuration files have been written."

