/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { user } from '../sample-data/checkout-flow';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Adds a delivery address to the given cart of the current user.
       * Returns address object.
       *
       * @memberof Cypress.Chainable
       *
       * @example
        ```
        cy.requireDeliveryAddressAdded(address, token, cartCode);
        ```
       */
      requireDeliveryAddressAdded: (
        address: {},
        token: {},
        cartId?: string
      ) => Cypress.Chainable<{}>;
    }
  }
}

Cypress.Commands.add(
  'requireDeliveryAddressAdded',
  (address, token, cartId) => {
    Cypress.log({
      displayName: 'requireDeliveryAddressAdded',
      message: [`Adding delivery address with token ${token.access_token}`],
    });

    const _address = {
      ...address,
      firstName: user.firstName,
      lastName: user.lastName,
      town: address.city,
      postalCode: address.postal,
      titleCode: 'mr',
      country: {
        isocode: 'US',
        name: user.address.country,
      },
      defaultAddress: false,
    };
    const cartCode = cartId || 'current';

    function addAddress() {
      return cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL')}/${Cypress.env(
          'OCC_PREFIX'
        )}/${Cypress.env(
          'BASE_SITE'
        )}/users/current/carts/${cartCode}/addresses/delivery`,
        body: _address,
        form: false,
        headers: {
          Authorization: `bearer ${token.access_token}`,
        },
      });
    }

    addAddress().then((resp) => cy.wrap(resp));
  }
);
