/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductReference } from '../../../model/product.model';
import { ProductReferencesAdapter } from './product-references.adapter';

@Injectable({
  providedIn: 'root',
})
export class ProductReferencesConnector {
  constructor(protected adapter: ProductReferencesAdapter) {}

  get(
    productCode: string,
    referenceType?: string,
    pageSize?: number
  ): Observable<ProductReference[]> {
    return this.adapter.load(productCode, referenceType, pageSize);
  }
}
