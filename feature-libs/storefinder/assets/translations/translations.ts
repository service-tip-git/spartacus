/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';

export const storeFinderTranslations: TranslationResources = {
  en,
};

export const storeFinderTranslationChunksConfig: TranslationChunksConfig = {
  storeFinder: ['storeFinder'],
};
