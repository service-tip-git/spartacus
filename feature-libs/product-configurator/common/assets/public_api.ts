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
 * @deprecated use **specific language** translations from `@spartacus/product-configurator/common/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/product-configurator/common/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const configuratorTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/product-configurator/common/assets` instead
 */
export const configuratorTranslationChunksConfig = translationChunksConfig;
