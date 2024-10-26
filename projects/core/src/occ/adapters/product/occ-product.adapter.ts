/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take, of, distinctUntilChanged } from 'rxjs';
import { Product } from '../../../model/product.model';
import { PRODUCT_NORMALIZER } from '../../../product/connectors/product/converters';
import { ProductAdapter } from '../../../product/connectors/product/product.adapter';
import { ScopedProductData } from '../../../product/connectors/product/scoped-product-data';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { ScopedDataWithUrl } from '../../services/occ-fields.service';
import { OccRequestsOptimizerService } from '../../services/occ-requests-optimizer.service';
import { ProductScope } from '../../../product/model/product-scope';

@Injectable()
export class OccProductAdapter implements ProductAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService,
    protected requestsOptimizer: OccRequestsOptimizerService
  ) {}

  loadRealTimeStock(
    productCode: string,
    unit: string
  ): Observable<{ quantity: string; availability: string }> {
    const availabilityUrl = this.occEndpoints.buildUrl('product', {
      scope: ProductScope.PRODUCT_AVAILABILITIES,
      urlParams: {
        productCode: productCode,
        sapCode: unit,
      },
    });

    return this.http.get(availabilityUrl).pipe(
      take(1),
      distinctUntilChanged(),
      switchMap((availabilities: any) => {
        const quantity =
          availabilities?.availabilityItems[0]?.unitAvailabilities[0]
            ?.quantity ?? '';
        const availability =
          availabilities?.availabilityItems[0]?.unitAvailabilities[0]?.status ??
          '';
        return of({ quantity, availability });
      })
    );
  }

  load(productCode: string, scope?: string): Observable<Product> {
    return this.http
      .get(this.getEndpoint(productCode, scope))
      .pipe(this.converter.pipeable(PRODUCT_NORMALIZER));
  }

  loadMany(products: ScopedProductData[]): ScopedProductData[] {
    const scopedDataWithUrls: ScopedDataWithUrl[] = products.map((model) => ({
      scopedData: model,
      url: this.getEndpoint(model.code, model.scope),
    }));

    return this.requestsOptimizer
      .scopedDataLoad<Occ.Product>(scopedDataWithUrls)
      .map(
        (scopedProduct) =>
          ({
            ...scopedProduct,
            data$: scopedProduct.data$?.pipe(
              this.converter.pipeable(PRODUCT_NORMALIZER)
            ),
          }) as ScopedProductData
      );
  }

  protected getEndpoint(code: string, scope?: string): string {
    return this.occEndpoints.buildUrl('product', {
      urlParams: { productCode: code },
      scope,
    });
  }
}
