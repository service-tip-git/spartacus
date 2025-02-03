/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConverterService, OccEndpointsService } from '@spartacus/core';
import { CartUserEmailResponse } from '@spartacus/opf/checkout/root';
import { Observable } from 'rxjs';
import { OpfCheckoutAdapter } from '../connectors';

@Injectable()
export class OpfApiCheckoutAdapter implements OpfCheckoutAdapter {
  protected http = inject(HttpClient);
  protected converter = inject(ConverterService);
  protected occEndpointsService = inject(OccEndpointsService);

  getCartUserEmail(
    userId: string,
    cartId: string
  ): Observable<CartUserEmailResponse> {
    return this.http.get<CartUserEmailResponse>(
      this.occEndpointsService.buildUrl('cartUserEmail', {
        urlParams: { userId, cartId },
      })
    );
  }
}
