/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  accountSummaryTranslationChunksConfig,
  accountSummaryTranslationsEn,
  accountSummaryTranslationsJa,
  accountSummaryTranslationsDe,
  accountSummaryTranslationsZh,
} from '@spartacus/organization/account-summary/assets';
import {
  AccountSummaryRootModule,
  ORGANIZATION_ACCOUNT_SUMMARY_FEATURE,
} from '@spartacus/organization/account-summary/root';

@NgModule({
  imports: [AccountSummaryRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ORGANIZATION_ACCOUNT_SUMMARY_FEATURE]: {
          module: () =>
            import('@spartacus/organization/account-summary').then(
              (m) => m.AccountSummaryModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: accountSummaryTranslationsEn,
          ja: accountSummaryTranslationsJa,
          de: accountSummaryTranslationsDe,
          zh: accountSummaryTranslationsZh,
        },
        chunks: accountSummaryTranslationChunksConfig,
      },
    }),
  ],
})
export class AccountSummaryFeatureModule {}
