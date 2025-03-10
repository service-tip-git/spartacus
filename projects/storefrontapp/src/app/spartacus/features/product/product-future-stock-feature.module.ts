/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
  futureStockTranslationChunksConfig,
  futureStockTranslationsEn,
  futureStockTranslationsJa,
  futureStockTranslationsDe,
  futureStockTranslationsZh,
} from '@spartacus/product/future-stock/assets';
import { FutureStockRootModule } from '@spartacus/product/future-stock/root';
import { provideConfig } from '@spartacus/core';
import { PRODUCT_FUTURE_STOCK_FEATURE } from '@spartacus/product/future-stock/root';

@NgModule({
  imports: [FutureStockRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [PRODUCT_FUTURE_STOCK_FEATURE]: {
          module: () =>
            import('@spartacus/product/future-stock').then(
              (m) => m.FutureStockModule
            ),
        },
      },
      i18n: {
        resources: {
          en: futureStockTranslationsEn,
          ja: futureStockTranslationsJa,
          de: futureStockTranslationsDe,
          zh: futureStockTranslationsZh,
        },
        chunks: futureStockTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class FutureStockFeatureModule {}
