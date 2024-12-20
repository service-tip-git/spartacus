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
 * @deprecated use **specific language** translations from `@spartacus/asm/customer-360/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/asm/customer-360/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const asmCustomer360Translations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/asm/customer-360/assets` instead
 */
export const asmCustomer360TranslationChunksConfig = translationChunksConfig;
