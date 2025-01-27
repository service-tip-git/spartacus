/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  orderApprovalTranslationChunksConfig,
  orderApprovalTranslationsEn,
  orderApprovalTranslationsJa,
  orderApprovalTranslationsDe,
  orderApprovalTranslationsZh,
} from '@spartacus/organization/order-approval/assets';
import {
  OrderApprovalRootModule,
  ORGANIZATION_ORDER_APPROVAL_FEATURE,
} from '@spartacus/organization/order-approval/root';

@NgModule({
  imports: [OrderApprovalRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ORGANIZATION_ORDER_APPROVAL_FEATURE]: {
          module: () =>
            import('@spartacus/organization/order-approval').then(
              (m) => m.OrderApprovalModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: orderApprovalTranslationsEn,
          ja: orderApprovalTranslationsJa,
          de: orderApprovalTranslationsDe,
          zh: orderApprovalTranslationsZh,
        },
        chunks: orderApprovalTranslationChunksConfig,
      },
    }),
  ],
})
export class OrderApprovalFeatureModule {}
