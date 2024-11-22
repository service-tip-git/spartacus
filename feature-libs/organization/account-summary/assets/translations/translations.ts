/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en';
import { ja } from './ja';
import { de } from './de';
import { zh } from './zh';

export const accountSummaryTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

export const accountSummaryTranslationChunksConfig: TranslationChunksConfig = {
  accountSummary: ['orgAccountSummary', 'orgAccountSummaryList'],
};
