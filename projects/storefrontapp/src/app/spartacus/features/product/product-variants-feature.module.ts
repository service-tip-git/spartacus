/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  productVariantsTranslationChunksConfig,
  productVariantsTranslationsEn,
  productVariantsTranslationsJa,
  productVariantsTranslationsDe,
  productVariantsTranslationsZh,
} from '@spartacus/product/variants/assets';
import {
  ProductVariantsRootModule,
  PRODUCT_VARIANTS_FEATURE,
} from '@spartacus/product/variants/root';

@NgModule({
  imports: [ProductVariantsRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [PRODUCT_VARIANTS_FEATURE]: {
          module: () =>
            import('@spartacus/product/variants').then(
              (m) => m.ProductVariantsModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: productVariantsTranslationsEn,
          ja: productVariantsTranslationsJa,
          de: productVariantsTranslationsDe,
          zh: productVariantsTranslationsZh,
        },
        chunks: productVariantsTranslationChunksConfig,
      },
    }),
  ],
})
export class ProductVariantsFeatureModule {}
