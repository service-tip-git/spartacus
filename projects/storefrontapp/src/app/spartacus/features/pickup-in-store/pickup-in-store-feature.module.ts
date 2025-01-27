/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { provideConfig } from '@spartacus/core';
import {
  PickupInStoreRootModule,
  PICKUP_IN_STORE_FEATURE,
} from '@spartacus/pickup-in-store/root';

import {
  pickupInStoreTranslationChunksConfig,
  pickupInStoreTranslationsEn,
  pickupInStoreTranslationsJa,
  pickupInStoreTranslationsDe,
  pickupInStoreTranslationsZh,
} from '@spartacus/pickup-in-store/assets';

@NgModule({
  imports: [PickupInStoreRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [PICKUP_IN_STORE_FEATURE]: {
          module: () =>
            import('@spartacus/pickup-in-store').then(
              (m) => m.PickupInStoreModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: {
          en: pickupInStoreTranslationsEn,
          ja: pickupInStoreTranslationsJa,
          de: pickupInStoreTranslationsDe,
          zh: pickupInStoreTranslationsZh,
        },
        chunks: pickupInStoreTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class PickupInStoreFeatureModule {}
