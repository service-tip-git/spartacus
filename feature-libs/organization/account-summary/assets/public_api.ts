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
 * @deprecated use **specific language** translations from `@spartacus/organization/account-summary/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/organization/account-summary/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const accountSummaryTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/organization/account-summary/assets` instead
 */
export const accountSummaryTranslationChunksConfig = translationChunksConfig;
