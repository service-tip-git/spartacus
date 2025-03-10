/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as anonymousConsents from '../../../../helpers/anonymous-consents';
import { goToCart } from '../../../../helpers/cart';
import * as checkoutFlowPersistentUser from '../../../../helpers/checkout-as-persistent-user';
import * as checkoutFlow from '../../../../helpers/checkout-flow';
import { verifyConsentManagementPage } from '../../../../helpers/consent-management';
import * as loginHelper from '../../../../helpers/login';
import { navigation } from '../../../../helpers/navigation';
import * as productSearch from '../../../../helpers/product-search';
import {
  createProductQuery,
  QUERY_ALIAS,
} from '../../../../helpers/product-search';
import {
  cdsHelper,
  strategyRequestAlias,
} from '../../../../helpers/vendor/cds/cds';
import { profileTagHelper } from '../../../../helpers/vendor/cds/profile-tag';

describe('Profile-tag events', () => {
  beforeEach(() => {
    cdsHelper.setUpMocks(strategyRequestAlias);
    navigation.visitHomePage({
      options: {
        onBeforeLoad: profileTagHelper.interceptProfileTagJs,
      },
    });
    profileTagHelper.waitForCMSComponents();
    anonymousConsents.clickAllowAllFromBanner();
  });
  describe('cart events', () => {
    it('should send AddedToCart and CartSnapshot events on adding an item to cart', () => {
      goToProductPage();
      cy.get('cx-add-to-cart button.btn-primary').click();
      cy.get('cx-added-to-cart-dialog .btn-primary');
      cy.window().should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.ADDED_TO_CART
          )
        ).to.equal(1);
        const addedToCartEvent = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.ADDED_TO_CART
        )[0];
        expect(addedToCartEvent.data.productQty).to.eq(1);
        expect(addedToCartEvent.data.productSku).to.eq('280916');
        expect(addedToCartEvent.data.categories).to.contain('577');
        expect(addedToCartEvent.data.categories).to.contain('brand_745');
        expect(addedToCartEvent.data.productCategory).to.eq('brand_745');
        expect(addedToCartEvent.data.productPrice).to.eq(8.2);
        expect(addedToCartEvent.data.cartId.length).to.eq(36);
        expect(addedToCartEvent.data.cartCode.length).to.eq(8);

        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CART_SNAPSHOT
          )
        ).to.equal(1);
        const cartSnapshotEvent = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CART_SNAPSHOT
        )[0];
        expect(cartSnapshotEvent.data.cart.entries.length).to.eq(1);
      });
    });

    it('should send CartModified and CartSnapshot events on modifying the cart', () => {
      goToProductPage();
      cy.intercept({
        method: 'GET',
        path: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
          'BASE_SITE'
        )}/users/anonymous/carts/*`,
      }).as('getRefreshedCart');
      cy.get('cx-add-to-cart button.btn-primary').click();
      cy.get('cx-added-to-cart-dialog .btn-primary').click();
      cy.wait(500);
      cy.get('tr[cx-cart-item-list-row] cx-item-counter')
        .get(`[aria-label="Add one more"]`)
        .first()
        .click();
      cy.wait('@getRefreshedCart');
      cy.wait(1500);
      cy.window().should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.MODIFIED_CART
          )
        ).to.equal(1);
        const modifiedCart = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.MODIFIED_CART
        )[0];
        expect(modifiedCart.data.productQty).to.eq(2);
        expect(modifiedCart.data.productSku).to.eq('280916');
        expect(modifiedCart.data.categories).to.contain('577');
        expect(modifiedCart.data.categories).to.contain('brand_745');
        expect(modifiedCart.data.productCategory).to.eq('brand_745');
        expect(modifiedCart.data.cartId.length).to.eq(36);
        expect(modifiedCart.data.cartCode.length).to.eq(8);

        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CART_SNAPSHOT
          )
        ).to.equal(2);
        const cartSnapshotEvent = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CART_SNAPSHOT
        )[1];
        expect(cartSnapshotEvent.data.cart.entries.length).to.eq(1);
        expect(cartSnapshotEvent.data.cart.entries[0].quantity).to.eq(2);
      });
    });

    it('should send RemovedFromCart and CartSnapshot events on removing an item from the cart', () => {
      goToProductPage();
      cy.get('cx-add-to-cart button.btn-primary').click();
      cy.get('cx-added-to-cart-dialog .btn-primary').click();
      cy.get('cx-cart-item-list .cx-remove-btn').first().click();
      cy.intercept({
        method: 'GET',
        path: `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
          'BASE_SITE'
        )}/users/anonymous/carts/*`,
      }).as('getRefreshedCart');
      cy.wait('@getRefreshedCart');
      cy.window().should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.REMOVED_FROM_CART
          )
        ).to.equal(1);
        const removedFromCart = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.REMOVED_FROM_CART
        )[0];
        expect(removedFromCart.data.productSku).to.eq('280916');
        expect(removedFromCart.data.categories).to.contain('577');
        expect(removedFromCart.data.categories).to.contain('brand_745');
        expect(removedFromCart.data.productCategory).to.eq('brand_745');
        expect(removedFromCart.data.cartId.length).to.eq(36);
        expect(removedFromCart.data.cartCode.length).to.eq(8);

        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CART_SNAPSHOT
          )
        ).to.equal(2);
        const cartSnapshotEvent = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CART_SNAPSHOT
        )[1];
        expect(cartSnapshotEvent.data.cart.entries.length).to.eq(0);
      });
    });
  });

  it('should send a product detail page view event when viewing a product', () => {
    cy.intercept({ method: 'GET', path: `**reviews*` }).as('lastRequest');
    const productSku = 280916;
    const productName = 'Web Camera (100KpixelM CMOS, 640X480, USB 1.1) Black';
    const productPrice = 8.2;
    const productCategory = 'brand_745';
    const productCategoryName = 'Canyon';
    goToProductPage();
    cy.wait('@lastRequest');
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.PRODUCT_DETAILS_PAGE_VIEWED
        )
      ).to.equal(1);
      const productViewedEvent = profileTagHelper.getEvent(
        win,
        profileTagHelper.EventNames.PRODUCT_DETAILS_PAGE_VIEWED
      )[0];
      expect(productViewedEvent.data.productSku).to.equal(`${productSku}`);
      expect(productViewedEvent.data.productName).to.equal(productName);
      expect(productViewedEvent.data.productPrice).to.equal(productPrice);
      expect(productViewedEvent.data.productCategory).to.equal(productCategory);
      expect(productViewedEvent.data.productCategoryName).to.equal(
        productCategoryName
      );
    });
  });

  it('should send a search page view event when viewing a search page', () => {
    createProductQuery(QUERY_ALIAS.CAMERA, 'camera', 12);
    cy.get('cx-searchbox input').type('camera{enter}');
    cy.wait(`@${QUERY_ALIAS.CAMERA}`);
    profileTagHelper.waitForCMSComponents();
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.KEYWORD_SEARCH
        )
      ).to.equal(1);
      const keywordSearchEvent = profileTagHelper.getEvent(
        win,
        profileTagHelper.EventNames.KEYWORD_SEARCH
      )[0];
      expect(keywordSearchEvent.data.numResults).to.greaterThan(0);
      expect(keywordSearchEvent.data.searchTerm).to.equal('camera');
    });
  });

  it('should send a CartPageViewed event when viewing the cart page', () => {
    goToProductPage();
    cy.get('cx-add-to-cart button.btn-primary').click();
    cy.get('cx-added-to-cart-dialog .btn-primary').click();
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      `/electronics-spa/en/USD/cart`
    );
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.CART_PAGE_VIEWED
        )
      ).to.equal(1);
    });
  });

  it('should not send a CartSnapshot event when viewing the cart page', () => {
    goToCart();
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      `/electronics-spa/en/USD/cart`
    );
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.CART_SNAPSHOT
        )
      ).to.equal(0);
    });
  });

  it('should send an OrderConfirmation event when viewing the order confirmation page', () => {
    profileTagHelper.triggerLoaded();
    profileTagHelper.triggerConsentReferenceLoaded();
    loginHelper.loginAsDefaultUser();

    cy.wait(0).then(() => {
      cy.selectUserMenuOption({
        option: 'Consent Management',
      });
      verifyConsentManagementPage();
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index === 1) {
          cy.wrap($elem).uncheck();
          cy.wrap($elem).should('not.be.checked');
          cy.wrap($elem).check();
        }
      });
    });

    cy.visit('/');
    checkoutFlowPersistentUser.goToProductPageFromCategory();
    checkoutFlowPersistentUser.addProductToCart();
    checkoutFlowPersistentUser.addPaymentMethod();
    cy.wait(0).then(() => {
      checkoutFlowPersistentUser.addShippingAddress();
    });
    checkoutFlowPersistentUser.selectShippingAddress();
    checkoutFlowPersistentUser.selectDeliveryMethod();
    checkoutFlowPersistentUser.selectPaymentMethod();
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      `checkout/review-order`
    );
    checkoutFlowPersistentUser.verifyAndPlaceOrder();
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      `order-confirmation`
    );
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.ORDER_CONFIRMATION_PAGE_VIEWED
        )
      ).to.equal(1);
    });
  });

  it('should send a Category View event when a Category View occurs', () => {
    cy.intercept({ method: 'GET', path: `**/products/search**` }).as(
      'lastRequest'
    );
    const productCategory = '575';
    const productCategoryName = 'Digital Cameras';
    cy.get('cx-category-navigation cx-generic-link a')
      .contains('Cameras')
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', `c/575`);
    cy.wait('@lastRequest');
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
        )
      ).to.equal(1);
      const categoryViewedEvent = profileTagHelper.getEvent(
        win,
        profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
      )[0];
      expect(categoryViewedEvent.data.productCategory).to.equal(
        productCategory
      );
      expect(categoryViewedEvent.data.productCategoryName).to.equal(
        productCategoryName
      );
    });
  });

  it('should send 2 Category View events when going to a Category, going to a different page type, and then back to the same category', () => {
    cy.intercept({ method: 'GET', path: `**/products/search**` }).as(
      'lastRequest'
    );
    cy.get('cx-category-navigation cx-generic-link a')
      .contains('Cameras')
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', `c/575`);
    cy.wait('@lastRequest').then(() => {
      cy.window().should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
          )
        ).to.equal(1);
      });
    });

    createProductQuery(QUERY_ALIAS.CAMERA, 'camera', 12);
    cy.get('cx-searchbox input').type('camera{enter}');
    cy.wait(`@${QUERY_ALIAS.CAMERA}`).then(() => {
      cy.window().should((win: any) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.KEYWORD_SEARCH
          )
        ).to.equal(1);
      });
    });

    cy.intercept({ method: 'GET', path: `**/products/search**` }).as(
      'lastRequest2'
    ); //waiting for the same request a 2nd time doesn't work
    cy.get('cx-category-navigation cx-generic-link a')
      .contains('Cameras')
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', `c/575`);
    cy.wait('@lastRequest2').then(() => {
      cy.window().should((win: any) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
          )
        ).to.equal(2);
      });
    });
  });

  it('should send 1 Category View event when going to a Category and clicking a facet', () => {
    cy.intercept({ method: 'GET', path: `**/products/search**` }).as(
      'lastRequest'
    );

    cy.get('cx-category-navigation cx-generic-link a')
      .contains('Cameras')
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', `c/575`);
    cy.wait('@lastRequest');
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
        )
      ).to.equal(1);
    });
    productSearch.clickFacet('Stores');

    cy.window().should((win2) => {
      expect(
        profileTagHelper.eventCount(
          win2,
          profileTagHelper.EventNames.CATEGORY_PAGE_VIEWED
        )
      ).to.equal(1);
    });
  });

  it('should send a Navigated event when a navigation to product page occurs', () => {
    goToProductPage();
    cy.get('cx-add-to-cart button.btn-primary').click();
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(win, profileTagHelper.EventNames.NAVIGATED)
      ).to.equal(1);
    });
  });

  it('should not send a Navigated event when merchandising banner is clicked', () => {
    const categoryPage = checkoutFlow.waitForCategoryPage('578', 'getCategory');
    cy.get('.Section1 cx-banner cx-generic-link a').first().click();
    cy.wait(`@${categoryPage}`).its('response.statusCode').should('eq', 200);
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(win, profileTagHelper.EventNames.NAVIGATED)
      ).to.equal(0);
    });
  });
});

// For some reason these two events interfere with eachother. Only 1 needs to click the allow all banner
// and the next will then have consent granted
describe('Consent Changed', () => {
  beforeEach(() => {
    cdsHelper.setUpMocks(strategyRequestAlias);
    navigation.visitHomePage({
      options: {
        onBeforeLoad: profileTagHelper.interceptProfileTagJs,
      },
    });
    profileTagHelper.waitForCMSComponents();
  });
  it('should send a consentGranted = false before accepting consent, and a consentGranted=true after accepting', () => {
    cy.wait(2000);
    cy.window()
      .should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.CONSENT_CHANGED
          )
        ).to.equal(2);
        const consentRejected = profileTagHelper.getEvent(
          win,
          profileTagHelper.EventNames.CONSENT_CHANGED
        )[0];
        expect(consentRejected.data.granted).to.eq(false);
      })
      .then(() => {
        anonymousConsents.clickAllowAllFromBanner();
      });
    cy.window().should((win) => {
      expect(
        profileTagHelper.eventCount(
          win,
          profileTagHelper.EventNames.CONSENT_CHANGED
        )
      ).to.equal(3);
      const consentAccepted = profileTagHelper.getEvent(
        win,
        profileTagHelper.EventNames.CONSENT_CHANGED
      )[2];
      expect(consentAccepted.data.granted).to.eq(true);
    });
  });

  it('should not send a consentgranted=false event on a page refresh', () => {
    anonymousConsents.clickAllowAllFromBanner();
    cy.reload();
    cy.window().should((win) => {
      const consentAccepted = profileTagHelper.getEvent(
        win,
        profileTagHelper.EventNames.CONSENT_CHANGED
      );
      expect(consentAccepted.length).to.equal(1);
      expect(consentAccepted[0].data.granted).to.eq(true);
    });
  });
  it('should send a HomePageViewed event when viewing the homepage', () => {
    anonymousConsents.clickAllowAllFromBanner();
    cy.reload();
    profileTagHelper.waitForCMSComponents().then(() => {
      cy.window().should((win) => {
        expect(
          profileTagHelper.eventCount(
            win,
            profileTagHelper.EventNames.HOME_PAGE_VIEWED
          )
        ).to.equal(1);
      });
    });
  });
});

describe('Cart merging on login', () => {
  const loginAlias = 'loginNotification';
  beforeEach(() => {
    cdsHelper.setUpMocks(strategyRequestAlias);
    cy.intercept({
      method: 'POST',
      path: '**/users/current/loginnotification**',
    }).as(loginAlias);
    navigation.visitHomePage({
      options: {
        onBeforeLoad: profileTagHelper.interceptProfileTagJs,
      },
    });
    profileTagHelper.waitForCMSComponents();
  });

  it('should send a CartSnapshot event when a cart gets merged after a successful login', () => {
    anonymousConsents.clickAllowAllFromBanner();
    loginHelper.registerUser();
    loginHelper.loginUser();
    cy.wait(`@${loginAlias}`);

    // reload and wait for all components to be loaded
    cy.reload();
    profileTagHelper.waitForCMSComponents();
    profileTagHelper.triggerLoaded();
    profileTagHelper.triggerConsentReferenceLoaded();

    // add first product to cart (logged in user)
    gotToProductPageWithProductCode('280916');
    cy.get('cx-add-to-cart button.btn-primary').click();
    verifyCartSnapshotEventNumberOfEntries(cy, 1);

    // logout
    loginHelper.signOutUser();

    // add second product to cart (first product for anonymous user)
    gotToProductPageWithProductCode('932577');
    cy.get('cx-add-to-cart button.btn-primary').click();
    verifyCartSnapshotEventNumberOfEntries(cy, 1);

    //login again, merge of carts should occur and a cart snapshot event with two products should be sent
    cy.visit('/login');
    loginHelper.loginUser();
    cy.wait(`@${loginAlias}`);

    verifyCartSnapshotEventNumberOfEntries(cy, 2);
  });
});

function goToProductPage(): Cypress.Chainable<number> {
  const productCode = '280916';
  const productPage = checkoutFlow.waitForProductPage(
    productCode,
    'getProductPage'
  );
  cy.get('.Section4 cx-banner').first().find('a').click({ force: true });
  return cy
    .wait(`@${productPage}`)
    .its('response.statusCode')
    .should('eq', 200);
}

function gotToProductPageWithProductCode(
  productCode: string
): Cypress.Chainable<number> {
  const productPage = checkoutFlow.waitForProductPage(
    productCode,
    'getProductPage'
  );
  cy.visit(`/product/${productCode}`);
  return cy
    .wait(`@${productPage}`)
    .its('response.statusCode')
    .should('eq', 200);
}

function verifyCartSnapshotEventNumberOfEntries(
  cy: Cypress.cy,
  expectedNumberOfEntries: number
) {
  cy.window().should((win) => {
    expect(
      profileTagHelper.eventCount(
        win,
        profileTagHelper.EventNames.CART_SNAPSHOT
      )
    ).to.equal(1);
    const cartSnapshotEvent = profileTagHelper.getEvent(
      win,
      profileTagHelper.EventNames.CART_SNAPSHOT
    )[0];
    expect(cartSnapshotEvent.data.cart.entries.length).to.eq(
      expectedNumberOfEntries
    );
  });
}
