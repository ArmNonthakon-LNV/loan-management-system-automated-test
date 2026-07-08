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
