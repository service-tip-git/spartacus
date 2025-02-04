/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OpfCheckoutConnector } from '../connectors';

@Injectable()
/**
 * Service responsible for checking whether a cart user has a valid email.
 */
export class OpfCartUserEmailCheckerService {
  protected opfCheckoutConnector = inject(OpfCheckoutConnector);

  /**
   * Checks if the user associated with a cart has a valid email.
   * The method considers an email as valid if it is different from `demo@example.com`.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} cartId - The unique identifier of the cart.
   * @returns {Observable<boolean>} - An observable that emits `true` if the user has a valid email, otherwise `false`.
   */
  isCartUserHasEmail(userId: string, cartId: string): Observable<boolean> {
    return this.opfCheckoutConnector
      .getCartUserEmail(userId, cartId)
      .pipe(map((value) => value.sapCustomerEmail !== 'demo@example.com'));
  }
}
