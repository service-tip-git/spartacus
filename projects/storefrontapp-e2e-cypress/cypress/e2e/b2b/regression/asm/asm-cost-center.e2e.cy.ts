/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as asm from '../../../../helpers/asm';
import * as b2bCheckout from '../../../../helpers/b2b/b2b-checkout';
import * as checkout from '../../../../helpers/checkout-flow';
import * as alerts from '../../../../helpers/global-message';
import { POWERTOOLS_BASESITE } from '../../../../sample-data/b2b-checkout';

context('B2B - ASM Account Checkout', () => {
  const invalid_cost_center = 'Rustic_Global';
  const valid_cost_center = 'Pronto_Services';
  const customer = {
    fullName: 'William Hunter',
    email: 'william.hunter@pronto-hw.com',
  };

  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
    Cypress.env('BASE_SITE', POWERTOOLS_BASESITE);
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should show error on invalid cost center', () => {
    cy.log('--> Agent logging in');
    checkout.visitHomePage('asm=true');
    cy.get('cx-asm-main-ui').should('exist');
    cy.get('cx-asm-main-ui').should('be.visible');
    asm.agentLogin('brandon.leclair@acme.com', 'pw4all');
    cy.log('--> Agent emulate customer');
    asm.startCustomerEmulation(customer, true);

    b2bCheckout.addB2bProductToCartAndCheckout();
    cy.get('cx-payment-type').within(() => {
      cy.findByText('Account').click({ force: true });
    });
    cy.get('button.btn-primary').should('be.enabled').click({ force: true });
    cy.intercept('PUT', '*costcenter?costCenterId=*').as('costCenterReq');

    cy.get('cx-cost-center').within(() => {
      cy.get('select').then((select) => {
        cy.get('select').select(valid_cost_center);
        if (select.find(`option:contains("${invalid_cost_center}")`).length) {
          cy.get('select').select(invalid_cost_center);
          cy.wait('@costCenterReq')
            .its('response.statusCode')
            .should('eq', 400);
          alerts.getErrorAlert().contains('Invalid cost center.');
          alerts.getErrorAlert().then((alert) => {
            cy.wrap(alert).within(() => {
              cy.get('button').click();
            });
          });
        }
      });
    });
  });
});
