/*
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
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { ListNavigationModule } from '@spartacus/storefront';
import { ApproverGuard } from '../../core/guards/approver.guard';
import { OrderApprovalListComponent } from './order-approval-list.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        OrderApprovalListComponent: {
          component: OrderApprovalListComponent,
          guards: [AuthGuard, ApproverGuard],
        },
      },
    }),
    UrlModule,
    RouterModule,
    ListNavigationModule,
    I18nModule,
    FeaturesConfigModule,
  ],
  declarations: [OrderApprovalListComponent],
  exports: [OrderApprovalListComponent],
})
export class OrderApprovalListModule {}
