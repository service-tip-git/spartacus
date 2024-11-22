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

export const orderTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

export const orderTranslationChunksConfig: TranslationChunksConfig = {
  order: [
    'orderDetails',
    'orderHistory',
    'AccountOrderHistoryTabContainer',
    'returnRequestList',
    'returnRequest',
    'reorder',
  ],
  myAccountV2Order: [
    'myAccountV2OrderHistory',
    'myAccountV2OrderDetails',
    'myAccountV2Orders',
  ],
};
