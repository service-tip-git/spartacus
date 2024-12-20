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
 * @deprecated use **specific language** translations from `@spartacus/organization/administration/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/organization/administration/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const organizationTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/organization/administration/assets` instead
 */
export const organizationTranslationChunksConfig = translationChunksConfig;
