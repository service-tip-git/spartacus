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
 *             -   resources: accountSummaryTranslations
 *             +   resources: { en: accountSummaryTranslationsEn }
 *               }
 *             ```
 */
export const accountSummaryTranslations = {
  en,
};

export { cs as accountSummaryTranslationsCs } from './cs/index';
export { de as accountSummaryTranslationsDe } from './de/index';
export { en as accountSummaryTranslationsEn } from './en/index';
export { es as accountSummaryTranslationsEs } from './es/index';
export { es_CO as accountSummaryTranslationsEs_CO } from './es_CO/index';
export { fr as accountSummaryTranslationsFr } from './fr/index';
export { hi as accountSummaryTranslationsHi } from './hi/index';
export { hu as accountSummaryTranslationsHu } from './hu/index';
export { id as accountSummaryTranslationsId } from './id/index';
export { it as accountSummaryTranslationsIt } from './it/index';
export { ja as accountSummaryTranslationsJa } from './ja/index';
export { ko as accountSummaryTranslationsKo } from './ko/index';
export { pl as accountSummaryTranslationsPl } from './pl/index';
export { pt as accountSummaryTranslationsPt } from './pt/index';
export { ru as accountSummaryTranslationsRu } from './ru/index';
export { zh as accountSummaryTranslationsZh } from './zh/index';
export { zh_TW as accountSummaryTranslationsZh_TW } from './zh_TW/index';
