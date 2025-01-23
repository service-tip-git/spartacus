/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  orderTranslationChunksConfig,
  orderTranslationsEn,
  orderTranslationsJa,
  orderTranslationsDe,
  orderTranslationsZh,
} from '@spartacus/order/assets';
import {
  USE_MY_ACCOUNT_V2_ORDER,
  OrderRootModule,
  ORDER_FEATURE,
} from '@spartacus/order/root';
import { environment } from '../../../../environments/environment';

@NgModule({
  imports: [OrderRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ORDER_FEATURE]: {
          module: () =>
            import('./order-wrapper.module').then((m) => m.OrderWrapperModule),
        },
      },
    }),
    {
      provide: USE_MY_ACCOUNT_V2_ORDER,
      useValue: environment.myAccountV2,
    },
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: orderTranslationsEn,
          ja: orderTranslationsJa,
          de: orderTranslationsDe,
          zh: orderTranslationsZh,
        },
        chunks: orderTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class OrderFeatureModule {}
