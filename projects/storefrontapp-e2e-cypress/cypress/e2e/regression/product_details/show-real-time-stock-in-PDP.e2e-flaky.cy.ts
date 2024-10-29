/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { visitProductPage } from '../../../helpers/coupons/cart-coupon';
import * as sampleData from '../../../sample-data/inventory-display';

export const stockSelector = 'cx-add-to-cart .info';

export const GET_PRODUCT_AVAILABILITY_ENDPOINT_ALIAS = 'getProductDetails';

export function interceptProductAvailability(productCode: string) {
  cy.intercept(
    'GET',
    `${Cypress.env('OCC_PREFIX')}/apparel-uk-spa/productAvailabilities?filters=${productCode}:ST`
  ).as(GET_PRODUCT_AVAILABILITY_ENDPOINT_ALIAS);

  return GET_PRODUCT_AVAILABILITY_ENDPOINT_ALIAS;
}

export function configureInventoryDisplay(enable: boolean) {
  cy.cxConfig({
    cmsComponents: {
      ProductAddToCartComponent: {
        data: {
          inventoryDisplay: enable,
        },
      },
    },
    features: {
      realTimeStockDispaly: enable,
    },
  });
}

export function assertInventoryDisplay(
  productCode: string,
  alias: string,
  functionality: string
) {
  cy.get(`${alias}`).then((xhr) => {
    let isInventoryDisplayActive;
    cy.getCookie('cxConfigE2E')
      .should('exist')
      .then((data) => (isInventoryDisplayActive = data.value.includes('true')));

    const body = xhr.response.body;
    const code =
      body.availabilities?.availabilityItems[0]?.unitAvailabilities[0]
        .productCode;
    const stock =
      body.availabilities?.availabilityItems[0]?.unitAvailabilities[0].quantity;

    expect(code).to.equal(productCode);

    cy.get(stockSelector).then(($ele) => {
      const text = $ele.text().trim();

      if (isInventoryDisplayActive) {
        // Out of stock
        if (
          stock.stockLevelStatus === 'outOfStock' ||
          functionality === 'outOfStock'
        ) {
          expect(text).to.equal(sampleData.stockOutOfStockLabel);
        } else {
          if (stock?.stockLevel) {
            if (
              stock?.isValueRounded ||
              functionality === 'categoryThresholdLimitReached'
            ) {
              expect(text).to.equal(
                `${stock.stockLevel}+ ${sampleData.stockLabel}`
              );
            } else {
              expect(text).to.equal(
                `${stock.stockLevel} ${sampleData.stockLabel}`
              );
            }
          } else {
            expect(text).to.equal(`${sampleData.stockLabel}`);
          }
        }
      } else {
        if (
          stock.stockLevelStatus === 'outOfStock' ||
          functionality === 'outOfStock'
        ) {
          expect(text).to.equal(sampleData.stockOutOfStockLabel);
        } else {
          expect(text).to.equal(`${sampleData.stockLabel}`);
        }
      }
    });
  });
}

export function testInventoryDisplay(
  productCode: string,
  functionality: string = ''
) {
  const productDetailsAlias = interceptProductAvailability(productCode);
  visitProductPage(productCode);

  cy.wait(`@${productDetailsAlias}`)
    .its('response.statusCode')
    .should('eq', 200);

  assertInventoryDisplay(productCode, `@${productDetailsAlias}`, functionality);
}

describe('B2C - Real Time Stock Display - Inventory Display - disabled', () => {
  beforeEach(() => {
    cy.window().then((win) => win.sessionStorage.clear());
    configureInventoryDisplay(false);
  });

  it('should NOT render number of available stock', () => {
    testInventoryDisplay('M_CR_1015');
  });

  it("should render 'out of stock' if stock level 0 and inventory display is off", () => {
    testInventoryDisplay('M_CR_10151123', 'outOfStock');
  });
});

describe('Inventory Display - active', () => {
  beforeEach(() => {
    configureInventoryDisplay(true);
  });

  it('should render number of available stock', () => {
    testInventoryDisplay('M_CR_1015');
  });

  it("should render 'out of stock' if stock level 0 and inventory display is on", () => {
    testInventoryDisplay('M_CR_10151123', 'outOfStock');
  });
});
