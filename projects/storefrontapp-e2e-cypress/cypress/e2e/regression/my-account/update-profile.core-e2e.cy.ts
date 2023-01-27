/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as updateProfile from '../../../helpers/update-profile';
import { viewportContext } from '../../../helpers/viewport-context';

describe('My Account - Update Profile', () => {
  viewportContext(['desktop'], () => {
    before(() => {
      cy.clearAllLocalStorage();
      cy.window().then((win) => win.sessionStorage.clear());
    });
    updateProfile.testUpdateProfileLoggedInUser();
  });
});
