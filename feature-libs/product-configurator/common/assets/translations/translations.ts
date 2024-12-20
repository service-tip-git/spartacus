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
 *             -   resources: configuratorTranslations
 *             +   resources: { en: configuratorTranslationsEn }
 *               }
 *             ```
 */
export const configuratorTranslations = {
  en,
};

export { cs as configuratorTranslationsCs } from './cs/index';
export { de as configuratorTranslationsDe } from './de/index';
export { en as configuratorTranslationsEn } from './en/index';
export { es as configuratorTranslationsEs } from './es/index';
export { es_CO as configuratorTranslationsEs_CO } from './es_CO/index';
export { fr as configuratorTranslationsFr } from './fr/index';
export { hi as configuratorTranslationsHi } from './hi/index';
export { hu as configuratorTranslationsHu } from './hu/index';
export { id as configuratorTranslationsId } from './id/index';
export { it as configuratorTranslationsIt } from './it/index';
export { ja as configuratorTranslationsJa } from './ja/index';
export { ko as configuratorTranslationsKo } from './ko/index';
export { pl as configuratorTranslationsPl } from './pl/index';
export { pt as configuratorTranslationsPt } from './pt/index';
export { ru as configuratorTranslationsRu } from './ru/index';
export { zh as configuratorTranslationsZh } from './zh/index';
export { zh_TW as configuratorTranslationsZh_TW } from './zh_TW/index';
