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
 *             -   resources: bulkPricingTranslations
 *             +   resources: { en: bulkPricingTranslationsEn }
 *               }
 *             ```
 */
export const bulkPricingTranslations = {
  en,
};

export { cs as bulkPricingTranslationsCs } from './cs/index';
export { de as bulkPricingTranslationsDe } from './de/index';
export { en as bulkPricingTranslationsEn } from './en/index';
export { es as bulkPricingTranslationsEs } from './es/index';
export { es_CO as bulkPricingTranslationsEs_CO } from './es_CO/index';
export { fr as bulkPricingTranslationsFr } from './fr/index';
export { hi as bulkPricingTranslationsHi } from './hi/index';
export { hu as bulkPricingTranslationsHu } from './hu/index';
export { id as bulkPricingTranslationsId } from './id/index';
export { it as bulkPricingTranslationsIt } from './it/index';
export { ja as bulkPricingTranslationsJa } from './ja/index';
export { ko as bulkPricingTranslationsKo } from './ko/index';
export { pl as bulkPricingTranslationsPl } from './pl/index';
export { pt as bulkPricingTranslationsPt } from './pt/index';
export { ru as bulkPricingTranslationsRu } from './ru/index';
export { zh as bulkPricingTranslationsZh } from './zh/index';
export { zh_TW as bulkPricingTranslationsZh_TW } from './zh_TW/index';
