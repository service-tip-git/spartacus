/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
  customerTicketingTranslationChunksConfig,
  customerTicketingTranslationsEn,
  customerTicketingTranslationsJa,
  customerTicketingTranslationsDe,
  customerTicketingTranslationsZh,
} from '@spartacus/customer-ticketing/assets';
import {
  CustomerTicketingRootModule,
  CUSTOMER_TICKETING_FEATURE,
} from '@spartacus/customer-ticketing/root';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';

@NgModule({
  imports: [CustomerTicketingRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [CUSTOMER_TICKETING_FEATURE]: {
          module: () =>
            import('./customer-ticketing-wrapper.module').then(
              (m) => m.CustomerTicketingWrapperModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: customerTicketingTranslationsEn,
          ja: customerTicketingTranslationsJa,
          de: customerTicketingTranslationsDe,
          zh: customerTicketingTranslationsZh,
        },
        chunks: customerTicketingTranslationChunksConfig,
      },
    }),
  ],
})
export class CustomerTicketingFeatureModule {}
