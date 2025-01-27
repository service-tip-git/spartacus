/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

context('scroll Position Restoration', () => {
  it('should restore scroll position', () => {
    cy.intercept({
      method: 'GET',
      pathname: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
        'BASE_SITE'
      )}/cms/pages`,
      query: {
        pageType: 'ProductPage',
      },
    }).as('getPage');

    cy.intercept({
      method: 'GET',
      pathname: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
        'BASE_SITE'
      )}/cms/pages`,
      query: {
        pageType: 'CategoryPage',
      },
    }).as('getCategoryPage');

    cy.visit('/');

    cy.log('Go to category page');
    cy.get('cx-category-navigation a').eq(0).click();

    cy.get('cx-product-list-item').should('exist');
    cy.get('cx-product-list-item .cx-product-name a')
      .eq(3)
      .then(($productItem) => {
        const productName = $productItem.text();
        cy.wrap($productItem).scrollIntoView().click();

        cy.log('Go to product details page');
        verifyProductPageLoaded(productName);

        cy.get('cx-tab-paragraph-container button')
          .eq(2)
          .then(($button) => {
            cy.wrap($button).scrollIntoView().click();
            cy.get('cx-product-reviews').should('be.visible');
            cy.window().scrollTo('bottom');
          });

        cy.log('Go back to product list');
        cy.go(-1);
        waitForCategoryPageLoad();
        cy.window().its('scrollY').should('be.greaterThan', 0);

        cy.log('Go forward to product details');
        cy.go(1);
        verifyProductPageLoaded(productName);
        cy.window().then(($window) => {
          expect($window.scrollY).to.be.greaterThan(0);
        });
      });
  });
});

const verifyProductPageLoaded = (productName: string) => {
  cy.wait('@getPage').its('response.statusCode').should('eq', 200);
  cy.get(`cx-breadcrumb h1`).should('contain', productName);
};

const waitForCategoryPageLoad = () => {
  cy.wait('@getCategoryPage').its('response.statusCode').should('eq', 200);
};
