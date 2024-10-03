/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Product } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionProductService {
  isSubscription(product: Product): boolean {
    return product.sapSubscriptionTerm && product.sapPricePlan ? true : false;
  }
}
