/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as siteContextSelector from '../../../../helpers/site-context-selector';

describe('Language switch - registration page', () => {
  const registerPath = siteContextSelector.REGISTRATION_PATH;
  const deutschName = siteContextSelector.TITLE_DE;

  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
  });

  siteContextSelector.stub(
    siteContextSelector.LANGUAGE_REQUEST,
    siteContextSelector.LANGUAGES
  );

  describe('registration page', () => {
    it('should change language in the url', () => {
      siteContextSelector.verifySiteContextChangeUrl(
        registerPath,
        siteContextSelector.LANGUAGES,
        siteContextSelector.LANGUAGE_DE,
        siteContextSelector.LANGUAGE_LABEL,
        siteContextSelector.FULL_BASE_URL_DE_USD + registerPath
      );
    });

    it('should change language in the page', () => {
      siteContextSelector.siteContextChange(
        registerPath,
        siteContextSelector.LANGUAGES,
        siteContextSelector.LANGUAGE_DE,
        siteContextSelector.LANGUAGE_LABEL
      );

      cy.get('[formcontrolname="titleCode"]').ngSelect(deutschName);
      cy.get('[formcontrolname="titleCode"] .ng-value-label').should(
        'have.text',
        deutschName
      );
    });
  });
});
