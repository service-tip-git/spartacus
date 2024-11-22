/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';
import { ja } from './ja/index';
import { de } from './de/index';
import { zh } from './zh/index';

export const configuratorTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};
//empty for now but needed for schematics support
export const configuratorTranslationChunksConfig: TranslationChunksConfig = {};
