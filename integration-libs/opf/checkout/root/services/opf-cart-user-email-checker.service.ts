/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OpfCheckoutConnector } from '../connectors';

@Injectable()
export class OpfCartUserEmailCheckerService {
  protected opfCheckoutConnector = inject(OpfCheckoutConnector);

  isCartUserHasEmail(userId: string, cartId: string): Observable<boolean> {
    return this.opfCheckoutConnector
      .getCartUserEmail(userId, cartId)
      .pipe(map((value) => value.sapCustomerEmail !== 'demo@example.com'));
  }
}
