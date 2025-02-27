/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  storeFinderTranslationChunksConfig,
  storeFinderTranslationsEn,
  storeFinderTranslationsJa,
  storeFinderTranslationsDe,
  storeFinderTranslationsZh,
} from '@spartacus/storefinder/assets';
import {
  StoreFinderRootModule,
  STORE_FINDER_FEATURE,
} from '@spartacus/storefinder/root';

@NgModule({
  imports: [StoreFinderRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [STORE_FINDER_FEATURE]: {
          module: () =>
            import('@spartacus/storefinder').then((m) => m.StoreFinderModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: storeFinderTranslationsEn,
          ja: storeFinderTranslationsJa,
          de: storeFinderTranslationsDe,
          zh: storeFinderTranslationsZh,
        },
        chunks: storeFinderTranslationChunksConfig,
      },
    }),
  ],
})
export class StoreFinderFeatureModule {}
