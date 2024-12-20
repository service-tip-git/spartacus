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
 *             -   resources: dpTranslations
 *             +   resources: { en: dpTranslationsEn }
 *               }
 *             ```
 */
export const dpTranslations = {
  en,
};

export { cs as dpTranslationsCs } from './cs/index';
export { de as dpTranslationsDe } from './de/index';
export { en as dpTranslationsEn } from './en/index';
export { es as dpTranslationsEs } from './es/index';
export { es_CO as dpTranslationsEs_CO } from './es_CO/index';
export { fr as dpTranslationsFr } from './fr/index';
export { hi as dpTranslationsHi } from './hi/index';
export { hu as dpTranslationsHu } from './hu/index';
export { id as dpTranslationsId } from './id/index';
export { it as dpTranslationsIt } from './it/index';
export { ja as dpTranslationsJa } from './ja/index';
export { ko as dpTranslationsKo } from './ko/index';
export { pl as dpTranslationsPl } from './pl/index';
export { pt as dpTranslationsPt } from './pt/index';
export { ru as dpTranslationsRu } from './ru/index';
export { zh as dpTranslationsZh } from './zh/index';
export { zh_TW as dpTranslationsZh_TW } from './zh_TW/index';
