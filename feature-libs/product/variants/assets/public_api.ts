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
 * @deprecated use **specific language** translations from `@spartacus/product/variants/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/product/variants/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const productVariantsTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/product/variants/assets` instead
 */
export const productVariantsTranslationChunksConfig = translationChunksConfig;
