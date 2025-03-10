/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { I18nConfig, provideConfig } from '@spartacus/core';
import {
  quoteTranslationChunksConfig,
  quoteTranslationsEn,
  quoteTranslationsJa,
  quoteTranslationsDe,
  quoteTranslationsZh,
} from '@spartacus/quote/assets';
import {
  QUOTE_CART_GUARD_FEATURE,
  QUOTE_FEATURE,
  QUOTE_REQUEST_FEATURE,
  QuoteRootModule,
} from '@spartacus/quote/root';

@NgModule({
  imports: [QuoteRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [QUOTE_FEATURE]: {
          module: () => import('@spartacus/quote').then((m) => m.QuoteModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: quoteTranslationsEn,
          ja: quoteTranslationsJa,
          de: quoteTranslationsDe,
          zh: quoteTranslationsZh,
        },
        chunks: quoteTranslationChunksConfig,
      },
    }),
    provideConfig({
      featureModules: {
        [QUOTE_CART_GUARD_FEATURE]: {
          module: () =>
            import('@spartacus/quote/components/cart-guard').then(
              (m) => m.QuoteCartGuardComponentModule
            ),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [QUOTE_REQUEST_FEATURE]: {
          module: () =>
            import('@spartacus/quote/components/request-button').then(
              (m) => m.QuoteRequestButtonModule
            ),
        },
      },
    }),
  ],
})
export class QuoteFeatureModule {}
