/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { OutletModule } from '@spartacus/storefront';
import { CheckoutOrderSummaryComponent } from './checkout-order-summary.component';

@NgModule({
  imports: [CommonModule, OutletModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutOrderSummary: {
          component: CheckoutOrderSummaryComponent,
        },
      },
    }),
  ],
  declarations: [CheckoutOrderSummaryComponent],
  exports: [CheckoutOrderSummaryComponent],
})
export class CheckoutOrderSummaryModule {}
