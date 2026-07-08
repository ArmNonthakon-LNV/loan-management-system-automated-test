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
