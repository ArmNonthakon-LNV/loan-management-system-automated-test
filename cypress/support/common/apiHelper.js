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
