/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { OpfCheckoutLoginComponent } from './opf-checkout-login.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
  ],
  declarations: [OpfCheckoutLoginComponent],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        OpfCheckoutLoginComponent: {
          component: OpfCheckoutLoginComponent,
        },
      },
    }),
  ],
  exports: [OpfCheckoutLoginComponent],
})
export class OpfCheckoutLoginModule {}
