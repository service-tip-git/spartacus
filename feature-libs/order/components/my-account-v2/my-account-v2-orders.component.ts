/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { Product } from '@spartacus/core';
import { MyAccountV2OrderHistoryService } from '@spartacus/order/core';
import { Order, OrderHistoryListView } from '@spartacus/order/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockDatePipe } from '../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { CxDatePipe } from '../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { SpinnerComponent } from '../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { MediaComponent } from '../../../../projects/storefrontlib/shared/components/media/media.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'cx-my-account-v2-orders',
  templateUrl: './my-account-v2-orders.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    MediaComponent,
    RouterLinkActive,
    SpinnerComponent,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class MyAccountV2OrdersComponent implements OnDestroy {
  protected service = inject(MyAccountV2OrderHistoryService);
  protected PAGE_SIZE = 3;
  orders$: Observable<OrderHistoryListView | undefined> = this.service
    .getOrderHistoryList(this.PAGE_SIZE)
    .pipe(tap(() => this.isLoaded$.next(true)));
  isLoaded$ = new BehaviorSubject<boolean>(false);
  getProduct(order: Order): Product | undefined {
    if (order.entries) {
      for (const entry of order.entries) {
        if (entry.product && entry.product.name && entry.product.images) {
          return entry.product;
        }
      }
      return order.entries[0].product;
    }
  }
  ngOnDestroy(): void {
    this.isLoaded$.next(false);
    this.service.clearOrderList();
  }
}
