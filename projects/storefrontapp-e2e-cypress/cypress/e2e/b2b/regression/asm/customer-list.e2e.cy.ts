/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as asm from '../../../../helpers/asm';
import * as checkout from '../../../../helpers/checkout-flow';
import { ELECTRONICS_BASESITE } from '../../../../helpers/checkout-flow';
import { POWERTOOLS_BASESITE } from '../../../../sample-data/b2b-checkout';
import { clearAllStorage } from '../../../../support/utils/clear-all-storage';

context('Assisted Service Module', () => {
  before(() => {
    clearAllStorage();
    Cypress.env('BASE_SITE', POWERTOOLS_BASESITE);
  });

  after(() => {
    Cypress.env('BASE_SITE', ELECTRONICS_BASESITE);
  });
  describe('ASM Customer list', () => {
    it('checking custom list features (CXSPA-1595)', () => {
      cy.cxConfig({
        context: {
          baseSite: ['powertools-spa'],
          currency: ['USD'],
        },
      });

      const b2bProductCodes = [
        '1979039',
        '3879436',
        '3755219',
        '3881018',
        '3592865',
      ];
      b2bProductCodes.forEach((productCode) => {
        asm.addProductToB2BCart('gi.sun@pronto-hw.com', 'pw4all', productCode);
      });

      checkout.visitHomePage('asm=true');
      cy.get('cx-asm-main-ui').should('exist');
      cy.get('cx-asm-main-ui').should('be.visible');

      asm.agentLogin('brandon.leclair@acme.com', 'pw4all');
      asm.asmB2bCustomerLists();
    });

    it('checking pagination (CXSPA-2109)', () => {
      cy.cxConfig({
        context: {
          baseSite: ['powertools-spa'],
          currency: ['USD'],
        },
      });
      checkout.visitHomePage('asm=true');
      cy.get('cx-asm-main-ui').should('exist');
      cy.get('cx-asm-main-ui').should('be.visible');

      asm.agentLogin('jules.hasson@acme.com', 'pw4all');
      asm.asmB2bCustomerListPagination();
    });
  });
});
