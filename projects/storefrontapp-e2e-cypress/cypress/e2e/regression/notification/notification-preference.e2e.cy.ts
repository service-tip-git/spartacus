/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  testEnableDisableNotification,
  updateEmail,
  verifyEmailChannel,
} from '../../../helpers/notification';
import { registerAndLogin } from '../../../helpers/update-email';
import { viewportContext } from '../../../helpers/viewport-context';
import { standardUser } from '../../../sample-data/shared-users';
import { clearAllStorage } from '../../../support/utils/clear-all-storage';

describe('Notification preference', () => {
  viewportContext(['mobile'], () => {
    describe('Logged in user', () => {
      before(() => {
        clearAllStorage();
        registerAndLogin();
        cy.visit('/');
      });

      // Core test. Run in mobile view as well.
      testEnableDisableNotification();
    });
  });

  viewportContext(['mobile', 'desktop'], () => {
    describe('Anonymous user', () => {
      before(() => {
        clearAllStorage();
      });

      it('should redirect to login page for anonymous user', () => {
        cy.visit('/my-account/notification-preference');
        cy.location('pathname').should('contain', '/login');
      });
    });

    describe('Logged in user', () => {
      before(() => {
        clearAllStorage();
        registerAndLogin();
        cy.visit('/');
      });

      it('should show correct email channel after update email address', () => {
        verifyEmailChannel(standardUser.registrationData.email);
        const newEmail = updateEmail();
        verifyEmailChannel(newEmail);
      });
    });
  });
});
