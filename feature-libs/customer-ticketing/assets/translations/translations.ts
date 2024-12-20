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
 *             -   resources: customerTicketingTranslations
 *             +   resources: { en: customerTicketingTranslationsEn }
 *               }
 *             ```
 */
export const customerTicketingTranslations = {
  en,
};

export { cs as customerTicketingTranslationsCs } from './cs/index';
export { de as customerTicketingTranslationsDe } from './de/index';
export { en as customerTicketingTranslationsEn } from './en/index';
export { es as customerTicketingTranslationsEs } from './es/index';
export { es_CO as customerTicketingTranslationsEs_CO } from './es_CO/index';
export { fr as customerTicketingTranslationsFr } from './fr/index';
export { hi as customerTicketingTranslationsHi } from './hi/index';
export { hu as customerTicketingTranslationsHu } from './hu/index';
export { id as customerTicketingTranslationsId } from './id/index';
export { it as customerTicketingTranslationsIt } from './it/index';
export { ja as customerTicketingTranslationsJa } from './ja/index';
export { ko as customerTicketingTranslationsKo } from './ko/index';
export { pl as customerTicketingTranslationsPl } from './pl/index';
export { pt as customerTicketingTranslationsPt } from './pt/index';
export { ru as customerTicketingTranslationsRu } from './ru/index';
export { zh as customerTicketingTranslationsZh } from './zh/index';
export { zh_TW as customerTicketingTranslationsZh_TW } from './zh_TW/index';
