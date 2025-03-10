/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FeatureToggles, OccConfig } from '@spartacus/core';
import { inject } from '@angular/core';

export function defaultOccSavedCartConfigFactory(): OccConfig {
  const featureToggles = inject(FeatureToggles);

  return {
    backend: {
      occ: {
        endpoints: {
          savedCarts:
            '/users/${userId}/carts?savedCartsOnly=true&fields=carts(DEFAULT,potentialProductPromotions,appliedProductPromotions,potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),totalUnitCount,deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),saveTime,user,name,description)',
          savedCart: '/users/${userId}/carts/${cartId}/savedcart',
          restoreSavedCart: '/users/${userId}/carts/${cartId}/restoresavedcart',
          cloneSavedCart:
            featureToggles.occCartNameAndDescriptionInHttpRequestBody
              ? '/users/${userId}/carts/${cartId}/clonesavedcart'
              : '/users/${userId}/carts/${cartId}/clonesavedcart?name=${saveCartName}',
        },
      },
    },
  };
}
