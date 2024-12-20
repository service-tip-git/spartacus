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
 * @deprecated use **specific language** translations from `@spartacus/opf/payment/assets` instead
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/opf/payment/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const opfPaymentTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/opf/payment/assets` instead
 */
export const opfPaymentTranslationChunksConfig = translationChunksConfig;
