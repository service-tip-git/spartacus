/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationResources } from '@spartacus/core';
import {
  translationChunksConfig,
  translationsEn,
} from './translations/translations';

export * from './translations/translations';

/**
 * @deprecated use **specific language** translations from `@spartacus/checkout/b2b/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/checkout/b2b/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const checkoutB2BTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/checkout/b2b/assets` instead
 */
export const checkoutB2BTranslationChunksConfig = translationChunksConfig;
