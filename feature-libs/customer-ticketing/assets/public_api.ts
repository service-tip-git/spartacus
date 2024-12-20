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
 * @deprecated use **specific language** translations from `@spartacus/customer-ticketing/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/customer-ticketing/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const customerTicketingTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/customer-ticketing/assets` instead
 */
export const customerTicketingTranslationChunksConfig = translationChunksConfig;
