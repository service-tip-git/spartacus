/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Cart } from '@spartacus/cart/base/root';
import { OutletContextData } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { AppliedCouponsComponent } from '../../cart-coupon/applied-coupons/applied-coupons.component';
import { NgIf } from '@angular/common';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';

@Component({
  selector: 'cx-order-summary',
  templateUrl: './order-summary.component.html',
  standalone: true,
  imports: [
    FeatureDirective,
    NgIf,
    AppliedCouponsComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  @Input()
  cart: Cart;

  protected subscription = new Subscription();

  constructor(@Optional() protected outlet?: OutletContextData<any>) {}

  ngOnInit(): void {
    if (this.outlet?.context$) {
      this.subscription.add(
        this.outlet.context$.subscribe((context) => (this.cart = context))
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
