/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './translations/index';
import { TranslationResources } from '@spartacus/core';
import {
  translationChunksConfig,
  translationsEn,
} from './translations/translations';

/**
 * @deprecated use **specific language** translations from `@spartacus/opf/checkout/assets` instead
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/opf/checkout/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const opfCheckoutTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/opf/checkout/assets` instead
 */
export const opfCheckoutTranslationChunksConfig = translationChunksConfig;
