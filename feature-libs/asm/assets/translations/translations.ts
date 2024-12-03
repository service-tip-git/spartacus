/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';

export const asmTranslations: TranslationResources = {
  en: {
    asm: () => import('./en/asm.json'),
  },
  de: {
    asm: () => import('./de/asm.json'),
  },
  ja: {
    asm: () => import('./ja/asm.json'),
  },
  zh: {
    asm: () => import('./zh/asm.json')
  },
};

export const asmTranslationChunksConfig: TranslationChunksConfig = {
  asm: ['asm'],
};
