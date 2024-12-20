/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './en/index';

/**
 * @deprecated use **specific language** translations (suffixed with language code) instead,
 * like in the following example:
 *             ```diff
 *               i18n: {
 *             -   resources: quoteTranslations
 *             +   resources: { en: quoteTranslationsEn }
 *               }
 *             ```
 */
export const quoteTranslations = {
  en,
};

export { cs as quoteTranslationsCs } from './cs/index';
export { de as quoteTranslationsDe } from './de/index';
export { en as quoteTranslationsEn } from './en/index';
export { es as quoteTranslationsEs } from './es/index';
export { es_CO as quoteTranslationsEs_CO } from './es_CO/index';
export { fr as quoteTranslationsFr } from './fr/index';
export { hi as quoteTranslationsHi } from './hi/index';
export { hu as quoteTranslationsHu } from './hu/index';
export { id as quoteTranslationsId } from './id/index';
export { it as quoteTranslationsIt } from './it/index';
export { ja as quoteTranslationsJa } from './ja/index';
export { ko as quoteTranslationsKo } from './ko/index';
export { pl as quoteTranslationsPl } from './pl/index';
export { pt as quoteTranslationsPt } from './pt/index';
export { ru as quoteTranslationsRu } from './ru/index';
export { zh as quoteTranslationsZh } from './zh/index';
export { zh_TW as quoteTranslationsZh_TW } from './zh_TW/index';
