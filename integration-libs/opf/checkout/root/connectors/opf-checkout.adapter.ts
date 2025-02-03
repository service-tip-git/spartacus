/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartUserEmailResponse } from '@spartacus/opf/checkout/root';
import { Observable } from 'rxjs';

export abstract class OpfCheckoutAdapter {
  /**
   * Abstract method to verify a response from PSP for Full Page Redirect
   * and iframe integration patterns.
   *
   */
  abstract getCartUserEmail(
    userId: string,
    cartId: string
  ): Observable<CartUserEmailResponse>;
}
