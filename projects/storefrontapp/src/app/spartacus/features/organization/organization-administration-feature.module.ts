/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  organizationTranslationChunksConfig,
  organizationTranslationsEn,
  organizationTranslationsJa,
  organizationTranslationsDe,
  organizationTranslationsZh,
} from '@spartacus/organization/administration/assets';
import {
  AdministrationRootModule,
  ORGANIZATION_ADMINISTRATION_FEATURE,
} from '@spartacus/organization/administration/root';

@NgModule({
  declarations: [],
  imports: [AdministrationRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ORGANIZATION_ADMINISTRATION_FEATURE]: {
          module: () =>
            import('./administration-wrapper.module').then(
              (m) => m.AdministrationWrapperModule
            ),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: organizationTranslationsEn,
          ja: organizationTranslationsJa,
          de: organizationTranslationsDe,
          zh: organizationTranslationsZh,
        },
        chunks: organizationTranslationChunksConfig,
      },
    }),
  ],
})
export class AdministrationFeatureModule {}
