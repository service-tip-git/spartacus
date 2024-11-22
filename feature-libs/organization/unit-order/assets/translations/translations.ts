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

export const unitOrderTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

// expose all translation chunk mapping for Unit-Level Order feature
export const unitOrderTranslationChunksConfig: TranslationChunksConfig = {
  unitOrder: [
    'unitLevelOrderHistory',
    'unitLevelOrderHistorySorting',
    'unitLevelOrderDetails',
  ],
};
