/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as alerts from './global-message';

export const CONSENT_MANAGEMENT = '/my-account/consents';

export function accessPageAsAnonymous() {
  cy.visit(CONSENT_MANAGEMENT);
  cy.location('pathname').should('contain', '/login');
}

export function verifyConsentManagementPage() {
  cy.get('cx-breadcrumb').within(() => {
    cy.get('h1').should('contain', 'Consent Management');
  });
}

export function giveConsent() {
  cy.get('input[type="checkbox"]').first().should('not.be.checked');
  cy.get('input[type="checkbox"]').first().check();
  cy.get('input[type="checkbox"]').first().should('be.checked');

  alerts.getSuccessAlert().should('contain', 'Consent successfully given');
}

export function checkConsentGivenDate() {
  cy.get('span[class="description"]').contains('Approved on');
}

export function withdrawConsent() {
  cy.get('input[type="checkbox"]').first().should('be.checked');
  cy.get('input[type="checkbox"]').first().uncheck();
  cy.get('input[type="checkbox"]').first().should('not.be.checked');

  alerts.getSuccessAlert().should('contain', 'Consent successfully withdrawn');
}

export function withdrawConsentV2() {
  cy.get('input[type="checkbox"]').first().should('be.checked');
  cy.get('input[type="checkbox"]').first().uncheck({ force: true });
  cy.get('input[type="checkbox"]').first().should('not.be.checked');

  alerts.getSuccessAlert().should('contain', 'Consent successfully withdrawn');
}

export function verifyAsAnonymous() {
  it('should redirect to login page for anonymous user', () => {
    accessPageAsAnonymous();
  });
}

export function consentManagementTest() {
  it('should be able to go to Consent Management Page', () => {
    verifyConsentManagementPage();
  });

  it('should successfully give a consent', () => {
    giveConsent();
  });

  it('should successfully withdraw a consent', () => {
    withdrawConsent();
  });
}

export function myAccountV2consentManagementTest() {
  it('should be able to go to Consent Management Page', () => {
    verifyConsentManagementPage();
  });

  it('should successfully give a consent and show give data', () => {
    giveConsent();
    checkConsentGivenDate();
  });

  it('should successfully withdraw a consent', () => {
    withdrawConsentV2();
  });
}
