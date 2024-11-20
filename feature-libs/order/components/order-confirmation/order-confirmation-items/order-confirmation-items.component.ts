/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  AbstractOrderType,
  CartOutlets,
  PromotionLocation,
} from '@spartacus/cart/base/root';
import { Order, OrderFacade } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { OutletDirective } from '@spartacus/storefront';
import { AbstractOrderContextDirective } from '../../../../cart/base/components/abstract-order-context/abstract-order-context.directive';
import { PromotionsComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-order-confirmation-items',
  templateUrl: './order-confirmation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    PromotionsComponent,
    AbstractOrderContextDirective,
    OutletDirective,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class OrderConfirmationItemsComponent implements OnDestroy {
  readonly cartOutlets = CartOutlets;
  readonly abstractOrderType = AbstractOrderType;
  promotionLocation: PromotionLocation = PromotionLocation.Checkout;
  order$: Observable<Order | undefined> = this.orderFacade.getOrderDetails();

  constructor(protected orderFacade: OrderFacade) {}

  ngOnDestroy() {
    this.orderFacade.clearPlacedOrder();
  }
}
