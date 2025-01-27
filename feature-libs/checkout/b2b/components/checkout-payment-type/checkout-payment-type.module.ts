/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartValidationGuard } from '@spartacus/cart/base/core';
import {
  CartNotEmptyGuard,
  CheckoutAuthGuard,
} from '@spartacus/checkout/base/components';
import {
  CmsConfig,
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
} from '@spartacus/core';
import { SpinnerModule } from '@spartacus/storefront';
import { CheckoutPaymentTypeComponent } from './checkout-payment-type.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPaymentType: {
          component: CheckoutPaymentTypeComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CartValidationGuard],
        },
      },
    }),
    FeaturesConfigModule,
  ],
  declarations: [CheckoutPaymentTypeComponent],
  exports: [CheckoutPaymentTypeComponent],
})
export class CheckoutPaymentTypeModule {}
