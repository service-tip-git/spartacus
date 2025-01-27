/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as anonymousConsents from '../../../../helpers/anonymous-consents';
import * as checkoutFlow from '../../../../helpers/checkout-flow';
import { navigation } from '../../../../helpers/navigation';
import {
  QUERY_ALIAS,
  createProductQuery,
  searchUrlPrefix,
} from '../../../../helpers/product-search';
import {
  cdsHelper,
  strategyRequestAlias,
} from '../../../../helpers/vendor/cds/cds';
import { profileTagHelper } from '../../../../helpers/vendor/cds/profile-tag';

describe('Custom header additions to occ calls', () => {
  describe('verifying X-Consent-Reference header addition to occ calls', () => {
    const X_CONSENT_REFERENCE_HEADER = 'x-consent-reference';
    let productPage;

    beforeEach(() => {
      cdsHelper.setUpMocks(strategyRequestAlias);
      navigation.visitHomePage({
        options: {
          onBeforeLoad: profileTagHelper.interceptProfileTagJs,
        },
      });
      profileTagHelper.waitForCMSComponents();
      productPage = checkoutFlow.waitForProductPage('280916', 'getProductPage');
      cy.intercept({ method: 'GET', path: `**/products/search**` }).as(
        'searchRequest'
      );
    });

    it('should not send CR header when consent is not granted initially', () => {
      cy.get('.Section4 cx-banner').first().find('a').click({ force: true });
      cy.wait(`@${productPage}`)
        .its('request.headers')
        .should('not.have.deep.property', X_CONSENT_REFERENCE_HEADER);
    });

    it('should send CR header when consent is granted and skip it once its revoked', () => {
      // grant consent
      anonymousConsents.clickAllowAllFromBanner();
      profileTagHelper.triggerLoaded();
      profileTagHelper.triggerConsentReferenceLoaded();
      cy.window().should((win) => {
        const consentAccepted = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CONSENT_CHANGED
        );
        expect(consentAccepted.length).to.equal(3);
        expect(consentAccepted[2].data.granted).to.eq(true);
      });
      cy.get('.Section4 cx-banner').first().find('a').click({ force: true });
      cy.wait(`@${productPage}`)
        .its('request.headers')
        .should('have.deep.property', X_CONSENT_REFERENCE_HEADER);
      // withdraw consent
      cy.get('button.btn.btn-link').contains('Consent').click();
      cy.get('input.form-check-input').uncheck();
      cy.get('button.close').first().click();
      navigation.visitHomePage({
        options: {
          onBeforeLoad: profileTagHelper.interceptProfileTagJs,
        },
      });
      cy.get('.Section4 cx-banner').first().find('a').click({ force: true });
      cy.wait(`@${productPage}`)
        .its('request.headers')
        .should('not.have.deep.property', X_CONSENT_REFERENCE_HEADER);
    });

    it('should send CR header on search/occ requests even on page refresh', () => {
      // grant consent
      anonymousConsents.clickAllowAllFromBanner();
      profileTagHelper.triggerLoaded();
      profileTagHelper.triggerConsentReferenceLoaded();
      cy.window().should((win) => {
        const consentAccepted = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CONSENT_CHANGED
        );
        expect(consentAccepted.length).to.equal(3);
        expect(consentAccepted[2].data.granted).to.eq(true);
      });

      cy.intercept({ method: 'GET', path: `${searchUrlPrefix}**` }).as(
        'getSearch'
      );

      // search for cameras
      createProductQuery(QUERY_ALIAS.CAMERA, 'camera', 12);
      cy.get('cx-searchbox input').type('camera{enter}');
      profileTagHelper.waitForCMSComponents();
      cy.wait(`@${QUERY_ALIAS.CAMERA}`);
      cy.wait('@getSearch')
        .its('request.headers')
        .should('have.deep.property', X_CONSENT_REFERENCE_HEADER);
      // refresh page
      cy.reload();
      // verify
      cy.wait(`@${QUERY_ALIAS.CAMERA}`);
      cy.wait('@getSearch')
        .its('request.headers')
        .should('have.deep.property', X_CONSENT_REFERENCE_HEADER);
    });
  });
});
