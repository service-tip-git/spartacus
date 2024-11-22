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

export const productImageZoomTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

// expose all translation chunk mapping for imageZoom feature
export const productImageZoomTranslationChunksConfig: TranslationChunksConfig =
  {
    productImageZoom: ['productImageZoomTrigger', 'productImageZoomDialog'],
  };
