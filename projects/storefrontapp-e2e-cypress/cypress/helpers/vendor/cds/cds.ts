/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as merchandisingCarousel from './merchandising-carousel';

export const strategyRequestAlias = 'strategyProductsApiRequest';

export const cdsHelper = {
  setUpMocks(alias: string): void {
    cy.intercept(
      {
        method: 'GET',
        path: '/strategy/*/strategies/*/products**',
      },
      { body: merchandisingCarousel.STRATEGY_RESPONSE }
    ).as(alias);
  },
  allowInsecureCookies(): void {
    cy.cxConfig({
      cds: {
        endpoints: {
          strategyProducts:
            '/strategy/${tenant}/strategies/${strategyId}/products',
        },
        profileTag: {
          allowInsecureCookies: true,
        },
      },
    });
  },
};
