/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { CartUserEmailResponse } from '@spartacus/opf/checkout/root';
import { Observable } from 'rxjs';
import { OpfCheckoutAdapter } from './opf-checkout.adapter';

@Injectable()
export class OpfCheckoutConnector {
  protected adapter = inject(OpfCheckoutAdapter);

  public getCartUserEmail(
    userId: string,
    cartId: string
  ): Observable<CartUserEmailResponse> {
    return this.adapter.getCartUserEmail(userId, cartId);
  }
}
