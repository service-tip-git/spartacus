/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { loginB2bUser } from '../../../../helpers/b2b/b2b-checkout';
import * as replenishmentDetails from '../../../../helpers/b2b/b2b-replenishment-order-details';
import {
  ORDER_REQUEST_ENDPOINT,
  POWERTOOLS_BASESITE,
  USER_REQUEST_ENDPOINT,
} from '../../../../sample-data/b2b-checkout';
import { isolateTests } from '../../../../support/utils/test-isolation';

describe('Replenishment order details', { testIsolation: false }, () => {
  isolateTests();
  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
    Cypress.env('BASE_SITE', POWERTOOLS_BASESITE);
    Cypress.env('OCC_PREFIX_USER_ENDPOINT', USER_REQUEST_ENDPOINT);
    Cypress.env('OCC_PREFIX_ORDER_ENDPOINT', ORDER_REQUEST_ENDPOINT);
  });

  it('should login and cancel a replenishment order details', () => {
    loginB2bUser();
    replenishmentDetails.cancelReplenishmentDetails();
  });
});
