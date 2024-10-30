/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Product, ProductAvailabilities } from '../../model/product.model';
import { DEFAULT_SCOPE } from '../../occ/occ-models/occ-endpoints.model';
import { ProductConnector } from '../connectors';
import { ProductScope } from '../model/product-scope';
import { ProductLoadingService } from '../services/product-loading.service';
import { StateWithProduct } from '../store/product-state';
import { ProductSelectors } from '../store/selectors/index';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  protected productConnector = inject(ProductConnector);
  constructor(
    protected store: Store<StateWithProduct>,
    protected productLoading: ProductLoadingService
  ) {}

  /**
   * Returns the product observable. The product will be loaded
   * whenever there's no value observed.
   *
   * The underlying product loader ensures that the product is
   * only loaded once, even in case of parallel observers.
   *
   * You should provide product data scope you are interested in to not load all
   * the data if not needed. You can provide more than one scope.
   *
   * @param productCode Product code to load
   * @param scopes Scope or scopes of the product data
   */
  get(
    productCode: string,
    scopes: (ProductScope | string)[] | ProductScope | string = DEFAULT_SCOPE
  ): Observable<Product | undefined> {
    return productCode
      ? this.productLoading.get(productCode, ([] as string[]).concat(scopes))
      : of(undefined);
  }

  /**
   * Returns boolean observable for product's loading state
   */
  isLoading(
    productCode: string,
    scope: ProductScope | string = ''
  ): Observable<boolean> {
    return this.store.pipe(
      select(
        ProductSelectors.getSelectedProductLoadingFactory(productCode, scope)
      )
    );
  }

  /**
   * Returns boolean observable for product's load success state
   */
  isSuccess(
    productCode: string,
    scope: ProductScope | string = ''
  ): Observable<boolean> {
    return this.store.pipe(
      select(
        ProductSelectors.getSelectedProductSuccessFactory(productCode, scope)
      )
    );
  }

  /**
   * Returns boolean observable for product's load error state
   */
  hasError(
    productCode: string,
    scope: ProductScope | string = ''
  ): Observable<boolean> {
    return this.store.pipe(
      select(
        ProductSelectors.getSelectedProductErrorFactory(productCode, scope)
      )
    );
  }

  getRealTimeStock(
    productCode: string,
    sapCode: string
  ): Observable<ProductAvailabilities> {
    return this.productConnector.getRealTimeStock(productCode, sapCode);
  }
}
