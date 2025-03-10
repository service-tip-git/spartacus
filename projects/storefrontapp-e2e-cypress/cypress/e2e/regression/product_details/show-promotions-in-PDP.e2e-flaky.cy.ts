/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export const APPAREL_BASESITE = 'apparel-uk-spa';
export const APPAREL_CURRENCY = 'GBP';
export const infoContainer = `cx-product-intro`;
export const promotionContainer = `cx-promotions`;
export const productID = 'PCS-01-ART148'; //use s9 system

describe('Promotions in PDP', () => {
  beforeEach(() => {
    Cypress.env('BASE_SITE', APPAREL_BASESITE);
    Cypress.env('BASE_CURRENCY', APPAREL_CURRENCY);
    cy.intercept({
      method: 'GET',
      path: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
        'BASE_SITE'
      )}/cms/pages?pageType=ProductPage**`,
    }).as('productPage');
  });
  it('should show promotions in Product Details Page', () => {
    cy.visit(`/product/${productID}`);
    cy.wait(`@productPage`);
    cy.get(`${infoContainer} .code`).should('contain', productID);
    cy.get(`${promotionContainer}`).should('be.visible');
  });
});
