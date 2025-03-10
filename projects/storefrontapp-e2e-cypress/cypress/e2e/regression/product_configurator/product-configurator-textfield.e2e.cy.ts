/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as cart from '../../../helpers/cart';
import * as configuration from '../../../helpers/product-configurator';
import * as textfieldConfiguration from '../../../helpers/textfield-configuration';
import * as common from '../../../helpers/common';

const electronicsShop = 'electronics-spa';
const testProduct = '1934793';
const ENGRAVED_TEXT = 'Engraved Text';
const HALLO = 'Hallo';

context('Textfield Configuration', () => {
  before(() => {
    cy.visit('/');
  });
  describe('Navigate to textfield configuration page', () => {
    it('should be able to navigate from the product search result', () => {
      configuration.searchForProduct(testProduct);
      textfieldConfiguration.clickOnConfigureButton();
    });

    it('should be able to navigate from the product details page', () => {
      textfieldConfiguration.goToProductDetailsPage(
        electronicsShop,
        testProduct
      );
      textfieldConfiguration.clickOnConfigureButton();
    });

    it('should be able to navigate from the cart', () => {
      textfieldConfiguration.goToConfigurationPage(
        electronicsShop,
        testProduct
      );
      textfieldConfiguration.checkConfigurationPageIsDisplayed();
      textfieldConfiguration.addToCartAndVerify(electronicsShop, testProduct);
      textfieldConfiguration.clickOnEditConfigurationLink(0);
    });

    it('should be able to navigate from the cart after adding product directly to the cart', () => {
      textfieldConfiguration.goToProductDetailsPage(
        electronicsShop,
        testProduct
      );
      common.clickOnAddToCartBtnOnPD();
      common.clickOnViewCartBtnOnPD();
      cart.verifyCartNotEmpty();
      textfieldConfiguration.clickOnEditConfigurationLink(0);
    });
  });
  describe('Configure product and add to cart', () => {
    it('should enter value and add product to cart', () => {
      textfieldConfiguration.goToConfigurationPage(
        electronicsShop,
        testProduct
      );
      textfieldConfiguration.checkConfigurationPageIsDisplayed();
      textfieldConfiguration.checkAttributeDisplayed(ENGRAVED_TEXT);
      textfieldConfiguration.selectAttribute(ENGRAVED_TEXT, HALLO);
      textfieldConfiguration.addToCartAndVerify(electronicsShop, testProduct);
    });

    it('should be able to update a configured product from the cart', () => {
      textfieldConfiguration.goToConfigurationPage(
        electronicsShop,
        testProduct
      );
      textfieldConfiguration.checkConfigurationPageIsDisplayed();
      textfieldConfiguration.addToCartAndVerify(electronicsShop, testProduct);
      textfieldConfiguration.clickOnEditConfigurationLink(0);
      textfieldConfiguration.checkAttributeDisplayed(ENGRAVED_TEXT);
      textfieldConfiguration.selectAttribute(ENGRAVED_TEXT, HALLO);
      textfieldConfiguration.addToCartAndVerify(electronicsShop, testProduct);
    });
  });
});
