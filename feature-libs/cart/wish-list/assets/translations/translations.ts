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
 *             -   resources: wishListTranslations
 *             +   resources: { en: wishListTranslationsEn }
 *               }
 *             ```
 */
export const wishListTranslations = {
  en,
};

export { cs as wishListTranslationsCs } from './cs/index';
export { de as wishListTranslationsDe } from './de/index';
export { en as wishListTranslationsEn } from './en/index';
export { es as wishListTranslationsEs } from './es/index';
export { es_CO as wishListTranslationsEs_CO } from './es_CO/index';
export { fr as wishListTranslationsFr } from './fr/index';
export { hi as wishListTranslationsHi } from './hi/index';
export { hu as wishListTranslationsHu } from './hu/index';
export { id as wishListTranslationsId } from './id/index';
export { it as wishListTranslationsIt } from './it/index';
export { ja as wishListTranslationsJa } from './ja/index';
export { ko as wishListTranslationsKo } from './ko/index';
export { pl as wishListTranslationsPl } from './pl/index';
export { pt as wishListTranslationsPt } from './pt/index';
export { ru as wishListTranslationsRu } from './ru/index';
export { zh as wishListTranslationsZh } from './zh/index';
export { zh_TW as wishListTranslationsZh_TW } from './zh_TW/index';
