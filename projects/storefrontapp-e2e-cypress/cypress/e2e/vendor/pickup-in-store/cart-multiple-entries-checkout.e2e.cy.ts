/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  configureApparelProduct,
  defaultAddress,
  defaultPaymentDetails,
  fillAddressForm,
  fillPaymentForm,
  LOCATORS as L,
  login,
  register,
  visitAlternativeProductPage,
} from '../../../helpers/pickup-in-store-utils';

import { viewportContext } from '../../../helpers/viewport-context';
/*

  - A guest user navigates to a PDP wishing to buy the product.
  - The user has the choice of whether they want the product delivered (the default) or whether they want to pick it up in store.
  - The user selects pickup in store.
  - The user selects which store they want to collect from (by default the last store they selected, falling back to the nearest store).
  - The user adds the product to the cart. (The cart entries post call will have the "deliveryPointOfService" field).
  - From the cart, the user can change the location they wish to pick up the product from.
  - The user also add another item only for delivery.(Multiple items in cart)
  - The user decides to login so the order will show in the user's account.
  - The logged in user checks out.
  - During checkout, the user cannot change the pickup location.
  - During the order review, the user cannot change the pickup location.
  - The user completes checkout and sees the order details. On here they can see their pickup location for the picket item and the delivery for the delivered item.
*/

describe('A user who has a cart with multiple entries checkout with BOPIS are run in Client-Side Rendering (CSR) mode', () => {
  viewportContext(['desktop'], () => {
    beforeEach(() => {
      configureApparelProduct();
    });

    it('A user who has a cart with multiple entries checkout with BOPIS are run in CSR mode (CXSPA-201)', () => {
      cy.intercept({
        method: 'POST',
        url: /users\/anonymous\/carts\/[0-9a-zA-Z|-]*\/entries/,
      }).as('apiAddToCart');

      cy.intercept({
        method: 'POST',
        url: '/authorizationserver/oauth/token',
      }).as('registerUser');

      // A guest user navigates to a PDP wishing to buy the product.

      // The user has the choice of whether they want the product delivered (the default) or whether they want to pick it up in store.
      cy.get(L.PICKUP_OPTIONS_RADIO_PICKUP).should('be.visible');
      cy.get(L.PICKUP_OPTIONS_RADIO_DELIVERY).should('be.visible');
      cy.get(L.PICKUP_OPTIONS_RADIO_DELIVERY).should('be.checked');

      // The user selects pickup in store.
      cy.get(L.PICKUP_OPTIONS_RADIO_PICKUP).click();
      cy.get(L.PICKUP_OPTIONS_RADIO_PICKUP).should('be.checked');
      cy.get(L.USE_MY_LOCATION).click();

      //The user selects which store they want to collect from (by default the last store they selected, falling back to the nearest store).
      cy.get(L.ACTIVE_PICK_UP_IN_STORE_BUTTON).first().click();
      cy.get(L.PICKUP_STORE_LOCATION)
        .invoke('attr', 'data-pickup-location')
        .then((firstStoreName) => cy.wrap(firstStoreName).as('firstStoreName'));

      // The user adds the product to the cart. (The cart entries post call will have the "deliveryPointOfService" field).
      cy.get(L.ADD_TO_CART).click();
      cy.wait('@apiAddToCart').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.request.body).to.have.property(
          'deliveryPointOfService'
        );
        cy.get(L.PICKUP_STORE_LOCATION)
          .invoke('text')
          .should(
            'be.equal',
            interception.request.body.deliveryPointOfService.name
          );
      });

      // From the cart, the user can change the location they wish to pick up the product from.
      cy.get(L.VIEW_CART).click();
      cy.url().should('include', '/cart');
      cy.get(L.PICKUP_STORE_LOCATION).should('be.visible');
      cy.get(L.CHANGE_STORE_LINK).click();
      cy.get(L.PICKUP_IN_STORE_MODAL).should('exist');
      cy.intercept({
        method: 'GET',
        url: /stores\/[0-9a-zA-Z|-]*?/,
      }).as('getStores');
      cy.get(L.ACTIVE_PICK_UP_IN_STORE_BUTTON).last().click({ force: true });
      cy.wait('@getStores').then((interception) => {
        cy.get('@firstStoreName').then((firstStoreName) => {
          cy.get(
            L.PICKUP_STORE_LOCATION_WITH_VALUE(interception.response.body.name)
          )
            .invoke('text')
            .should('not.equal', firstStoreName);
        });
      });

      // The user also add another item only for delivery.(Multiple items in cart)
      visitAlternativeProductPage();
      cy.get(L.ADD_TO_CART).click();
      cy.get(L.VIEW_CART).click();

      // The user decides to login so the order will show in the user's account.
      register();

      cy.wait('@registerUser').then((_interception) => {
        login();
      });

      // The logged in user checks out.
      cy.log('The logged in user checks out.');
      cy.wait(1000);
      cy.get(L.MINI_CART_BUTTON).click();
      cy.get(L.PROCEED_TO_CHECKOUT_BUTTON).click();
      fillAddressForm(defaultAddress);
      cy.get(L.CHECKOUT_ADDRESS_FORM_SUBMIT_BUTTON).click();
      cy.get(L.CHECKOUT_DELIVERY_MODE_CONTINUE_BUTTON).click();

      cy.log('During checkout, the user cannot change the pickup location');
      cy.get(L.PICKUP_OPTIONS_RADIO_PICKUP).should('not.exist');
      cy.get(L.PICKUP_OPTIONS_RADIO_DELIVERY).should('not.exist');

      fillPaymentForm(defaultPaymentDetails);
      cy.get(L.CHECKOUT_PAYMENT_FORM_CONTINUE_BUTTON).click();
      cy.log(
        'During the order review, the user cannot change the pickup location.'
      );
      cy.get(
        `cx-pickup-in-store-details-review ${L.PICKUP_OPTIONS_RADIO_DELIVERY}`
      ).should('not.exist');

      cy.log(
        '  - The user completes checkout and sees the order details. On here they can see their pickup location.'
      );
      cy.get(L.REVIEW_ORDER_TERM_CONDITION).click();
      cy.get(L.REVIEW_ORDER_SUBMIT).click();
      cy.get(L.ORDER_CONFIRMATION).should('exist');
    });
  });
});
