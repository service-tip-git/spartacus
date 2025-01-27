/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CartNotEmptyGuard,
  CheckoutAuthGuard,
} from '@spartacus/checkout/base/components';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { CheckoutScheduleReplenishmentOrderComponent } from './checkout-schedule-replenishment-order.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    IconModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutScheduleReplenishmentOrder: {
          component: CheckoutScheduleReplenishmentOrderComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [CheckoutScheduleReplenishmentOrderComponent],
  exports: [CheckoutScheduleReplenishmentOrderComponent],
})
export class CheckoutScheduleReplenishmentOrderModule {}
