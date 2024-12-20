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
 * @deprecated use **specific language** translations from `@spartacus/pdf-invoices/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/pdf-invoices/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const pdfInvoicesTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/pdf-invoices/assets` instead
 */
export const pdfInvoicesTranslationChunksConfig = translationChunksConfig;
