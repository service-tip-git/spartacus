/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as configurationOverview from './product-configurator-overview';
import * as configurationVc from './product-configurator-vc';

const cartItemQuantityStepperSelector = '.cx-value cx-item-counter';

/**
 * Alias used for patching the quantity
 */
export const PATCH_QUANTITY_IN_CART_ALIAS = '@patchQuantityInCart';

/**
 * Alias used for reading the cart
 */
export const GET_CART_ALIAS = '@getCart';

/**
 * Clicks on the 'Edit Configuration' link in cart for a certain cart item.
 *
 * @param {number} cartItemIndex - Index of cart item
 */
export function clickOnEditConfigurationLink(cartItemIndex: number): void {
  locateCartConfiguratorElement(cartItemIndex);
  cy.get('@aElement')
    .find('a:contains("Edit")')
    .click({
      force: true,
    })
    .then(() => {
      cy.location('pathname').should('contain', '/cartEntry/entityKey/');
    });
}

/**
 * Clicks on the 'Display Configuration' link in cart for a certain cart item.
 *
 * @param {number} cartItemIndex - Index of cart item
 */
export function clickOnDisplayConfigurationLink(cartItemIndex: number): void {
  locateCartConfiguratorElement(cartItemIndex);
  cy.get('@aElement')
    .find('a:contains("Display")')
    .click({
      force: true,
    })
    .then(() => {
      cy.location('pathname').should('contain', '/cartEntry/entityKey/');
    });
}

function locateCartConfiguratorElement(cartItemIndex: number): void {
  cy.get('cx-cart-item-list .cx-item-list-row')
    .eq(cartItemIndex)
    .find('cx-configure-cart-entry')
    .as('aElement');
}

/**
 * Clicks on the 'Remove' link in cart for a certain cart item to remove a cart item.
 *
 * @param {number} cartItemIndex - Index of cart item
 */
export function clickOnRemoveLink(cartItemIndex: number): void {
  cy.get('cx-cart-item-list .cx-item-list-row')
    .eq(cartItemIndex)
    .not('disabled')
    .find('.cx-remove-btn')
    .within(() => {
      cy.log('One cart item will be removed under index: ' + cartItemIndex);
      cy.get('button:contains("Remove")').click();
    });
}

/**
 * Verifies whether the mini-cart displays zero cart items.
 */
export function checkCartEmpty() {
  cy.get('cx-paragraph h2').contains('Your shopping cart is empty');
  cy.get('cx-mini-cart .count').contains('0');
}

/**
 * Navigates to the order details page.
 */
export function navigateToOrderDetails(): void {
  cy.log('Navigate to order detail page');
  // Verify whether the ordered product is displayed in the order list
  cy.get('cx-cart-item-list cx-configure-cart-entry a')
    .first()
    .click()
    .then(() => {
      configurationOverview.checkConfigOverviewPageDisplayed();
      configurationVc.checkGhostAnimationNotDisplayed();
    });
}

/**
 * Defines the order number alias.
 */
export function defineOrderNumberAlias(): void {
  cy.log('Define order number alias');
  const orderConfirmationText = 'Confirmation of Order:';

  cy.get('cx-order-confirmation-thank-you-message .cx-page-title')
    .first()
    .invoke('text')
    .then((text) => {
      expect(text).contains(orderConfirmationText);
      const orderNumber = text.replace(orderConfirmationText, '').trim();
      expect(orderNumber).match(/^[0-9]+$/);
      cy.wrap(orderNumber).as('orderNumber');
    });
}

/**
 * Verifies whether a quantity value that has entered into the quantity stepper is equal to the expected value.
 *
 * @param {number} cartItemIndex - Index of cart item
 * @param {number} quantity - Quantity value
 */
export function checkQuantityStepper(cartItemIndex: number, quantity: number) {
  cy.get('cx-cart-item-list .cx-item-list-row')
    .eq(cartItemIndex)
    .find('.cx-quantity')
    .as('aElement');

  cy.get('@aElement')
    .find(cartItemQuantityStepperSelector + ' input')
    .should('have.value', quantity.toString());
}

/**
 * Register quantity patch route using name @see PATCH_QUANTITY_IN_CART_ALIAS
 */
export function registerQuantityPatchRoute() {
  cy.intercept(
    'PATCH',
    `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
      'BASE_SITE'
    )}/users/*/carts/*/entries/0?lang=en&curr=USD`
  ).as(PATCH_QUANTITY_IN_CART_ALIAS.substring(1));
}

/**
 * Register cart route using name @see GET_CART_ALIAS
 */
export function registerCartRoute() {
  cy.intercept(
    'GET',
    `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
      'BASE_SITE'
    )}/users/*/carts/*?fields=DEFAULT*`
  ).as(GET_CART_ALIAS.substring(1));
}

function changeQuantityValue(cartItemIndex: number, sign: string) {
  cy.get('cx-cart-item-list .cx-item-list-row')
    .eq(cartItemIndex)
    .find('.cx-quantity')
    .as('aElement');

  cy.get('@aElement')
    .find(cartItemQuantityStepperSelector + ' button')
    .contains(sign)
    .click();
}

/**
 * Verifies how many items are in the cart
 *
 * @param items - number of items in the cart
 */
export function checkItemsList(items: number) {
  cy.get('.cx-item-list-items').within(() => {
    cy.get('.cx-item-list-row').should('have.length', items);
  });
}

/**
 * Increase a quantity value for the corresponding cart item in the cart and
 * wait for the patch and get requests to complete.
 *
 * Remark:
 * Remember to register the routes before using this function.
 * name @see registerQuantityPatchRoute and registerCartRoute functions.
 * The registration is only required once.
 *
 * @param {number} cartItemIndex - Index of cart item
 */
export function increaseQuantityInCartAndWait(cartItemIndex: number) {
  changeQuantityValue(cartItemIndex, '+');
  cy.wait(PATCH_QUANTITY_IN_CART_ALIAS);
  cy.wait(GET_CART_ALIAS);
}

/**
 * Decrease a quantity value for the corresponding cart item in the cart and
 * wait for the patch and get requests to complete.
 *
 * Remark:
 * Remember to register the routes before using this function.
 * name @see registerQuantityPatchRoute and registerCartRoute functions.
 * The registration is only required once.
 *
 * @param {number} cartItemIndex - Index of cart item
 */
export function decreaseQuantityInCartAndWait(cartItemIndex: number) {
  changeQuantityValue(cartItemIndex, '-');
  cy.wait(PATCH_QUANTITY_IN_CART_ALIAS);
  cy.wait(GET_CART_ALIAS);
}
