/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';
import { ProductListOutlets } from '../../product-outlets.model';
import { ProductListItemContextSource } from '../model/product-list-item-context-source.model';
import { ProductListItemContext } from '../model/product-list-item-context.model';
import { ProductListService } from '../product-list.service';

@Component({
  selector: 'cx-product-list-item',
  templateUrl: './product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
  standalone: false,
})
export class ProductListItemComponent implements OnChanges {
  protected productListService = inject(ProductListService);
  hideAddToCartButton = false;

  readonly ProductListOutlets = ProductListOutlets;
  @Input() product: any;

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.product) {
      this.hideAddToCartButton = this.hideAddToCartButton =
        this.productListService.shouldHideAddToCartButton(this.product);
      this.productListItemContextSource.product$.next(this.product);
    }
  }
}
