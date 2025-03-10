/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { MyCompanyConfig } from '../models/index';
import { loginAsMyCompanyAdmin } from '../my-company.utils';
import { testList } from './utils/list';

export function nestedListTest(config: MyCompanyConfig): void {
  describe(`${config.name} Nested List`, () => {
    beforeEach(() => {
      loginAsMyCompanyAdmin();
    });

    // TODO: Can be enabled when backend will sort the list (tree)
    xit('should show expanded nested list', () => {
      cy.visit(`/organization`);
      testList(config, {
        trigger: () =>
          cy
            .get(`cx-page-slot.BodyContent a[aria-label*="${config.name}"]`)
            .click(),
        nested: { expandAll: true },
      });
    });

    it('should show collapsed nested list', () => {
      cy.visit(`/organization`);
      testList(config, {
        trigger: () =>
          cy
            .get(`cx-page-slot.BodyContent a[aria-label*="${config.name}"]`)
            .click(),
        nested: { collapseAll: true },
      });
    });
  });
}
