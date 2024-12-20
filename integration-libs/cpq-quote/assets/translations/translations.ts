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
 *             -   resources: cpqquoteTranslations
 *             +   resources: { en: cpqquoteTranslationsEn }
 *               }
 *             ```
 */
export const cpqquoteTranslations = {
  en,
};

export { cs as cpqquoteTranslationsCs } from './cs/index';
export { de as cpqquoteTranslationsDe } from './de/index';
export { en as cpqquoteTranslationsEn } from './en/index';
export { es as cpqquoteTranslationsEs } from './es/index';
export { es_CO as cpqquoteTranslationsEs_CO } from './es_CO/index';
export { fr as cpqquoteTranslationsFr } from './fr/index';
export { hi as cpqquoteTranslationsHi } from './hi/index';
export { hu as cpqquoteTranslationsHu } from './hu/index';
export { id as cpqquoteTranslationsId } from './id/index';
export { it as cpqquoteTranslationsIt } from './it/index';
export { ja as cpqquoteTranslationsJa } from './ja/index';
export { ko as cpqquoteTranslationsKo } from './ko/index';
export { pl as cpqquoteTranslationsPl } from './pl/index';
export { pt as cpqquoteTranslationsPt } from './pt/index';
export { ru as cpqquoteTranslationsRu } from './ru/index';
export { zh as cpqquoteTranslationsZh } from './zh/index';
export { zh_TW as cpqquoteTranslationsZh_TW } from './zh_TW/index';
