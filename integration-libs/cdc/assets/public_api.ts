/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './translations/translations';
import { TranslationResources } from '@spartacus/core';
import {
  translationChunksConfig,
  translationsEn,
} from './translations/translations';

/**
 * @deprecated use **specific language** translations from `@spartacus/cdc/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/cdc/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const cdcTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/cdc/assets` instead
 */
export const cdcTranslationChunksConfig = translationChunksConfig;
