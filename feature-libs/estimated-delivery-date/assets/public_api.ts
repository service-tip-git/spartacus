/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationResources } from '@spartacus/core';
import {
  translationsEn,
  translationChunksConfig,
} from './translations/translations';

export * from './translations/translations';
/**
 * @deprecated use **specific language** translations from `@spartacus/estimated-delivery-date/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/estimated-delivery-date/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const estimatedDeliveryDateTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/estimated-delivery-date/assets` instead
 */
export const estimatedDeliveryDateTranslationChunksConfig =
  translationChunksConfig;
