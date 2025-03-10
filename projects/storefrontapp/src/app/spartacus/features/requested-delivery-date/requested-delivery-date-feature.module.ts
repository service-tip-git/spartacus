/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  requestedDeliveryDateTranslationChunksConfig,
  requestedDeliveryDateTranslationsEn,
  requestedDeliveryDateTranslationsJa,
  requestedDeliveryDateTranslationsDe,
  requestedDeliveryDateTranslationsZh,
} from '@spartacus/requested-delivery-date/assets';
import {
  RequestedDeliveryDateRootModule,
  REQUESTED_DELIVERY_DATE_FEATURE,
} from '@spartacus/requested-delivery-date/root';

@NgModule({
  imports: [RequestedDeliveryDateRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [REQUESTED_DELIVERY_DATE_FEATURE]: {
          module: () =>
            import('@spartacus/requested-delivery-date').then(
              (m) => m.RequestedDeliveryDateModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: requestedDeliveryDateTranslationsEn,
          ja: requestedDeliveryDateTranslationsJa,
          de: requestedDeliveryDateTranslationsDe,
          zh: requestedDeliveryDateTranslationsZh,
        },
        chunks: requestedDeliveryDateTranslationChunksConfig,
      },
    }),
  ],
})
export class RequestedDeliveryDateFeatureModule {}
