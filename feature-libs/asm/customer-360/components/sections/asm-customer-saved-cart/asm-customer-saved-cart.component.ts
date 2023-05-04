/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { concatMap, filter, map, take } from 'rxjs/operators';

import { ProductItem } from '../../asm-customer-product-listing/product-item.model';
import { Customer360SectionContext } from '../customer-360-section-context.model';
import {
  Customer360SavedCart,
  CustomerCart,
} from '@spartacus/asm/customer-360/root';
import { Product, ProductScope, ProductService } from '@spartacus/core';

@Component({
  selector: 'cx-asm-customer-saved-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './asm-customer-saved-cart.component.html',
})
export class AsmCustomerSavedCartComponent {
  savedCart$: Observable<CustomerCart | undefined>;
  productItems$: Observable<Array<ProductItem>>;

  constructor(
    protected sectionContext: Customer360SectionContext<Customer360SavedCart>,
    protected productService: ProductService
  ) {
    this.savedCart$ = this.sectionContext.data$.pipe(
      map((cart) => {
        return cart.savedCart;
      })
    );
    this.productItems$ = this.savedCart$.pipe(
      concatMap((cart) => {
        if (!cart?.entries?.length) {
          return of([]);
        } else {
          return forkJoin(
            cart.entries.map((entry) => {
              return this.productService
                .get(entry.productCode, ProductScope.DETAILS)
                .pipe(
                  filter((product): product is Product => Boolean(product)),
                  map((product) => {
                    return {
                      ...product,
                      quantity: entry.quantity,
                      basePrice: entry.basePrice,
                      totalPrice: entry.totalPrice,
                    } as ProductItem;
                  }),
                  take(1)
                );
            })
          );
        }
      })
    );
  }
}
