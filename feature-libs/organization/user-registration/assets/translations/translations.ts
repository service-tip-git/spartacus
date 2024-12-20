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
 *             -   resources: organizationUserRegistrationTranslations
 *             +   resources: { en: organizationUserRegistrationTranslationsEn }
 *               }
 *             ```
 */
export const organizationUserRegistrationTranslations = {
  en,
};

export { cs as organizationUserRegistrationTranslationsCs } from './cs/index';
export { de as organizationUserRegistrationTranslationsDe } from './de/index';
export { en as organizationUserRegistrationTranslationsEn } from './en/index';
export { es as organizationUserRegistrationTranslationsEs } from './es/index';
export { es_CO as organizationUserRegistrationTranslationsEs_CO } from './es_CO/index';
export { fr as organizationUserRegistrationTranslationsFr } from './fr/index';
export { hi as organizationUserRegistrationTranslationsHi } from './hi/index';
export { hu as organizationUserRegistrationTranslationsHu } from './hu/index';
export { id as organizationUserRegistrationTranslationsId } from './id/index';
export { it as organizationUserRegistrationTranslationsIt } from './it/index';
export { ja as organizationUserRegistrationTranslationsJa } from './ja/index';
export { ko as organizationUserRegistrationTranslationsKo } from './ko/index';
export { pl as organizationUserRegistrationTranslationsPl } from './pl/index';
export { pt as organizationUserRegistrationTranslationsPt } from './pt/index';
export { ru as organizationUserRegistrationTranslationsRu } from './ru/index';
export { zh as organizationUserRegistrationTranslationsZh } from './zh/index';
export { zh_TW as organizationUserRegistrationTranslationsZh_TW } from './zh_TW/index';
