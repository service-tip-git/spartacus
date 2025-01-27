/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import {
  OrderDetailItemsComponent,
  OrderDetailTotalsComponent,
  OrderDetailsService,
  OrderOverviewComponent,
} from '@spartacus/order/components';
import {
  BtnLikeLinkModule,
  FormErrorsModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { ApproverGuard } from '../../core/guards/approver.guard';
import { OrderApprovalDetailFormComponent } from './order-approval-detail-form/order-approval-detail-form.component';
import { OrderApprovalDetailService } from './order-approval-detail.service';
import { OrderDetailPermissionResultsComponent } from './order-detail-permission-results/order-detail-permission-results.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    UrlModule,
    FormErrorsModule,
    SpinnerModule,
    RouterModule,
    BtnLikeLinkModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        OrderApprovalDetailTotalsComponent: {
          component: OrderDetailTotalsComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: OrderApprovalDetailService,
            },
          ],
          guards: [AuthGuard, ApproverGuard],
        },
        OrderApprovalDetailApprovalDetailsComponent: {
          component: OrderDetailPermissionResultsComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: OrderApprovalDetailService,
            },
          ],
          guards: [AuthGuard, ApproverGuard],
        },
        AccountOrderDetailsApprovalDetailsComponent: {
          component: OrderDetailPermissionResultsComponent,
        },
        OrderApprovalDetailShippingComponent: {
          component: OrderOverviewComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: OrderApprovalDetailService,
            },
          ],
          guards: [AuthGuard, ApproverGuard],
        },
        OrderApprovalDetailItemsComponent: {
          component: OrderDetailItemsComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: OrderApprovalDetailService,
            },
          ],
          guards: [AuthGuard, ApproverGuard],
        },
        OrderApprovalDetailFormComponent: {
          component: OrderApprovalDetailFormComponent,
          guards: [AuthGuard, ApproverGuard],
        },
      },
    }),
    FeaturesConfigModule,
  ],
  declarations: [
    OrderApprovalDetailFormComponent,
    OrderDetailPermissionResultsComponent,
  ],
  exports: [
    OrderApprovalDetailFormComponent,
    OrderDetailPermissionResultsComponent,
  ],
})
export class OrderApprovalDetailsModule {}
