/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { OrderEntry } from '@spartacus/cart/base/root';
import { Product, useFeatureStyles } from '@spartacus/core';
import {
  ProductListItemContext,
  ProductListItemContextSource,
} from '@spartacus/storefront';
import { MockTranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { AtMessageDirective } from '@spartacus/storefront';
import { InnerComponentsHostDirective } from '@spartacus/storefront';
import { NgIf, NgFor } from '@angular/common';
import { MediaComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';

@Component({
  selector: '[cx-wish-list-item], cx-wish-list-item',
  templateUrl: './wish-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
  standalone: true,
  imports: [
    RouterLink,
    MediaComponent,
    NgIf,
    NgFor,
    InnerComponentsHostDirective,
    AtMessageDirective,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class WishListItemComponent implements OnChanges {
  @Input()
  isLoading = false;
  @Input() cartEntry: OrderEntry;

  @Output()
  remove = new EventEmitter<OrderEntry>();

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {
    useFeatureStyles('a11yCartItemsLinksStyles');
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.cartEntry) {
      this.productListItemContextSource.product$.next(
        this.cartEntry.product as Product
      );
    }
  }

  removeEntry(item: OrderEntry) {
    this.remove.emit(item);
  }
}
