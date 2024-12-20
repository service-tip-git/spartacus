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
 * @deprecated use **specific language** translations from `@spartacus/organization/order-approval/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/organization/order-approval/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const orderApprovalTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/organization/order-approval/assets` instead
 */
export const orderApprovalTranslationChunksConfig = translationChunksConfig;
