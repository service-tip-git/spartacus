/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { BtnLikeLinkModule, ListNavigationModule } from '@spartacus/storefront';
import { defaultReplenishmentOrderCancellationLayoutConfig } from '../replenishment-order-details/default-replenishment-order-cancellation-layout.config';
import { ReplenishmentOrderHistoryComponent } from './replenishment-order-history.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    BtnLikeLinkModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(defaultReplenishmentOrderCancellationLayoutConfig),
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        AccountReplenishmentHistoryComponent: {
          component: ReplenishmentOrderHistoryComponent,
          guards: [AuthGuard],
        },
      },
    }),
  ],
  declarations: [ReplenishmentOrderHistoryComponent],
  exports: [ReplenishmentOrderHistoryComponent],
})
export class ReplenishmentOrderHistoryModule {}
