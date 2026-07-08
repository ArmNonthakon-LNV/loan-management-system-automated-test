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
