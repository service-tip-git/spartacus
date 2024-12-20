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
 * @deprecated use **specific language** translations from `@spartacus/checkout/scheduled-replenishment/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/checkout/scheduled-replenishment/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const checkoutScheduledReplenishmentTranslations: TranslationResources =
  {
    en: translationsEn,
  };

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/checkout/scheduled-replenishment/assets` instead
 */
export const checkoutScheduledReplenishmentTranslationChunksConfig =
  translationChunksConfig;
