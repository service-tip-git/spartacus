/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { verifyTabbingOrder } from '../../tabbing-order';
import { TabElement } from '../../tabbing-order.model';

const containerSelector = 'main .LoginPageTemplate';

export function forgotPasswordTabbingOrder(config: TabElement[]) {
  cy.intercept({
    method: 'GET',
    pathname: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
      'BASE_SITE'
    )}/cms/components`,
  }).as('getComponents');
  cy.visit('/login/forgot-password');
  cy.wait('@getComponents');

  verifyTabbingOrder(containerSelector, config);
}
