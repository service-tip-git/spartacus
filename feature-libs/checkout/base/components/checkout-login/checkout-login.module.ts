/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { NotCheckoutAuthGuard } from '../guards/not-checkout-auth.guard';
import { CheckoutLoginComponent } from './checkout-login.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        GuestCheckoutLoginComponent: {
          component: CheckoutLoginComponent,
          guards: [NotCheckoutAuthGuard],
          // THIS guard blocks from opening /checkout-login
          // Event if user is there and provide email component will do the call to /electronics-spa/users/anonymous/carts/
          // But current cart is not anonymous
        },
      },
    }),
  ],
  declarations: [CheckoutLoginComponent],
  exports: [CheckoutLoginComponent],
})
export class CheckoutLoginModule {}
