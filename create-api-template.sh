#!/bin/bash

CATEGORY=$1
API=$2

if [ -z "$CATEGORY" ] || [ -z "$API" ]; then
  echo "❌ Usage: ./create-api-template.sh <category> <apiName>"
  exit 1
fi

echo "🚀 Creating API Template..."
echo "Category: $CATEGORY"
echo "API: $API"

# -----------------------
# CREATE FOLDERS
# -----------------------

mkdir -p cypress/e2e/$CATEGORY/$API

mkdir -p cypress/fixtures/$CATEGORY/$API/testCases/bizlogic
mkdir -p cypress/fixtures/$CATEGORY/$API/testCases/validateFields

mkdir -p cypress/fixtures/$CATEGORY/prepData

mkdir -p cypress/support/preSteps/$CATEGORY

# -----------------------
# CREATE TEST FILE
# -----------------------

cat <<EOF > cypress/e2e/$CATEGORY/$API/checkBizlogic.cy.js
/// <reference types="cypress" />

import { apiHelper } from "../../../support/common/apiHelper"

const lang = 'en_US'

describe('Check business logic of API ${API}', () => {

    beforeEach(() => {

        cy.fixture('${CATEGORY}/${API}/testCases/bizlogic/bizlogic.json').as('testCases')
        cy.fixture('${CATEGORY}/prepData/test.json').as('prepData')

        cy.get('@testCases').then(data => { globalThis.testCases = data })
        cy.get('@prepData').then(data => { globalThis.prepData = data })

    })

    context('Success Scenarios', () => {

        it('Display response success when call api with valid data', () => {
          const helper = new APIHelper()
          
          helper.setReqEndpoint(Cypress.env('endpoints').${API})
              .setReqMethod('POST')
              .setReqHeadersWithAuth(lang, accessToken, transactionId)
              .setReqBody(reqBody)
              .sendRequest('${API}')

          cy.get('@${API}').then(actualResult => {
              cy.log('actualResult:', JSON.stringify(actualResult.body))
              expect(201).to.equal(actualResult.status)
          })
        })        })

    })
EOF

# -----------------------
# CREATE VALIDATION TEST
# -----------------------

cat <<EOF > cypress/e2e/$CATEGORY/$API/checkValidateFields.cy.js
/// <reference types="cypress" />

import { apiHelper } from "../../../support/common/apiHelper"

const API_KEY = Cypress.env('bayApiKey') || 'DTxwkYcn7eOG1WYKCPApIOD5KmzrJ05SyagjU31Bfnk'
const lang = 'en_US'

describe('Check validate fields of API ${API}', () => {

    beforeEach(function () {

        cy.fixture('${CATEGORY}/prepData/test.json').as('prepData')
        cy.get('@prepData').then(data => { globalThis.prepData = data })

    })

    context('Check validate field: annotation', () => {

        beforeEach(() => {

            cy.fixture('${CATEGORY}/${API}/testCases/validateFields/fieldName1.json').then(data => {
                globalThis.testCaseFieldName1 = data
            })
        })

        it('annotationIsInteger', () => {
            runValidateFieldCase('annotationIsInteger')
        })

        it('annotationIsBoolean', () => {
            runValidateFieldCase('annotationIsBoolean')
        })

    })

})
EOF

# -----------------------
# CREATE TEST DATA (BIZLOGIC)
# -----------------------

cat <<EOF > cypress/fixtures/$CATEGORY/$API/testCases/bizlogic/bizlogic.json
{
  "bizlogicCase1": {
    "reqBody": {
      "fieldName1": ""
    },
    "expected": {
      "httpCode": 400,
      "error": "VALIDATION_ERROR"
    }
  },
  "bizlogicCase2": {
    "reqBody": {
      "fieldName1": ""
    },
    "expected": {
      "httpCode": 400,
      "error": "VALIDATION_ERROR"
    }
  }
}
EOF

# -----------------------
# CREATE TEST DATA (VALIDATE FIELDS)
# -----------------------

cat <<EOF > cypress/fixtures/$CATEGORY/$API/testCases/validateFields/fieldName1.json
{
    "validateFieldsCase1": {
      "reqBody": {
        "fieldName1": ""
      },
      "expected": {
        "httpCode": 400,
        "error": "VALIDATION_ERROR"
      }
    },
    "validateFieldsCase2": {
      "reqBody": {
        "fieldName1": ""
      },
      "expected": {
        "httpCode": 400,
        "error": "VALIDATION_ERROR"
      }
    }
}
EOF

cat <<EOF > cypress/fixtures/$CATEGORY/$API/testCases/validateFields/fieldName2.json
{
    "validateFieldsCase1": {
      "reqBody": {
        "fieldName1": ""
      },
      "expected": {
        "httpCode": 400,
        "error": "VALIDATION_ERROR"
      }
    },
    "validateFieldsCase2": {
      "reqBody": {
        "fieldName1": ""
      },
      "expected": {
        "httpCode": 400,
        "error": "VALIDATION_ERROR"
      }
    }
}
EOF

# -----------------------
# CREATE PRE-STEPS (OPTIONAL FLOW)
# -----------------------

cat <<EOF > cypress/support/preSteps/$CATEGORY/$API.js
import { APIHelper } from "../common/apiHelper"
export class Initiation {
    initiationTrx(reqBody, accessToken, transactionId) {
        const lang = 'en_US'
        const helper = new APIHelper()
        
        helper.setReqEndpoint(Cypress.env('endpoints').initiation)
            .setReqMethod('POST')
            .setReqHeadersWithAuth(lang, accessToken, transactionId)
            .setReqBody(reqBody)
            .sendRequest('initiation')

        cy.get('@initiation').then(actualResult => {
            cy.log('actualResult:', JSON.stringify(actualResult.body))
            expect(201).to.equal(actualResult.status)
        })
    }
}

export const onInitiation = new Initiation()
EOF

# -----------------------
# CREATE PREP DATA (ENV-SPECIFIC)
# -----------------------

cat <<EOF > cypress/fixtures/$CATEGORY/prepData/test.json
{
  "env": "test",
  "notes": "Put environment-specific prep data for category here",
  "data": {
    "wallet": {
      "activeWalletId": "900002149629",
      "activeWalletAppType": "DPV",
      "inactiveWalletId": "910000523404",
      "inactiveWalletAppType": "DPP",
      "freezeWalletId": "910000519299",
      "freezeWalletAppType": "DPP",
      "notExistsWalletId": "999999999999"
    }
  }
}
EOF

echo "✅ API Template created successfully"

echo ""
echo "Generated Structure:"
echo "cypress/e2e/$CATEGORY/$API/checkBizlogic.cy.js"
echo "cypress/e2e/$CATEGORY/$API/checkValidateFields.cy.js"
echo "cypress/fixtures/$CATEGORY/$API/testCases/bizlogic/bizlogic.json"
echo "cypress/fixtures/$CATEGORY/$API/testCases/validateFields/fieldName1.json"
echo "cypress/fixtures/$CATEGORY/$API/testCases/validateFields/fieldName2.json"
echo "cypress/fixtures/$CATEGORY/prepData/test.json"
echo "cypress/support/preSteps/$CATEGORY/$API.js"