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
 *             -   resources: s4omTranslations
 *             +   resources: { en: s4omTranslationsEn }
 *               }
 *             ```
 */
export const s4omTranslations = {
  en,
};

export { cs as s4omTranslationsCs } from './cs/index';
export { de as s4omTranslationsDe } from './de/index';
export { en as s4omTranslationsEn } from './en/index';
export { es as s4omTranslationsEs } from './es/index';
export { es_CO as s4omTranslationsEs_CO } from './es_CO/index';
export { fr as s4omTranslationsFr } from './fr/index';
export { hi as s4omTranslationsHi } from './hi/index';
export { hu as s4omTranslationsHu } from './hu/index';
export { id as s4omTranslationsId } from './id/index';
export { it as s4omTranslationsIt } from './it/index';
export { ja as s4omTranslationsJa } from './ja/index';
export { ko as s4omTranslationsKo } from './ko/index';
export { pl as s4omTranslationsPl } from './pl/index';
export { pt as s4omTranslationsPt } from './pt/index';
export { ru as s4omTranslationsRu } from './ru/index';
export { zh as s4omTranslationsZh } from './zh/index';
export { zh_TW as s4omTranslationsZh_TW } from './zh_TW/index';
