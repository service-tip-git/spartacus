/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
  asmTranslationChunksConfig,
  asmTranslationsEn,
  asmTranslationsJa,
  asmTranslationsDe,
  asmTranslationsZh,
} from '@spartacus/asm/assets';
import { AsmRootModule, ASM_FEATURE } from '@spartacus/asm/root';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';

@NgModule({
  imports: [AsmRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ASM_FEATURE]: {
          module: () => import('@spartacus/asm').then((m) => m.AsmModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: asmTranslationsEn,
          ja: asmTranslationsJa,
          de: asmTranslationsDe,
          zh: asmTranslationsZh,
        },
        chunks: asmTranslationChunksConfig,
      },
    }),
  ],
})
export class AsmFeatureModule {}
