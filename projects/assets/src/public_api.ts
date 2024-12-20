/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Public API Surface of assets
 */

export * from './translations/translation-chunks-config';
export * from './translations/translations';
import { translationsEn } from './translations/translations';

interface TranslationResources {
  [lang: string]: {
    [chunkName: string]: {
      [key: string]: any;
    };
  };
}

/**
 * @deprecated use **specific language** translations from `@spartacus/assets` instead,
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const translations: TranslationResources = {
  en: translationsEn,
};
