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
 *             -   resources: epdVisualizationTranslations
 *             +   resources: { en: epdVisualizationTranslationsEn }
 *               }
 *             ```
 */
export const epdVisualizationTranslations = {
  en,
};

export { cs as epdVisualizationTranslationsCs } from './cs/index';
export { de as epdVisualizationTranslationsDe } from './de/index';
export { en as epdVisualizationTranslationsEn } from './en/index';
export { es as epdVisualizationTranslationsEs } from './es/index';
export { es_CO as epdVisualizationTranslationsEs_CO } from './es_CO/index';
export { fr as epdVisualizationTranslationsFr } from './fr/index';
export { hi as epdVisualizationTranslationsHi } from './hi/index';
export { hu as epdVisualizationTranslationsHu } from './hu/index';
export { id as epdVisualizationTranslationsId } from './id/index';
export { it as epdVisualizationTranslationsIt } from './it/index';
export { ja as epdVisualizationTranslationsJa } from './ja/index';
export { ko as epdVisualizationTranslationsKo } from './ko/index';
export { pl as epdVisualizationTranslationsPl } from './pl/index';
export { pt as epdVisualizationTranslationsPt } from './pt/index';
export { ru as epdVisualizationTranslationsRu } from './ru/index';
export { zh as epdVisualizationTranslationsZh } from './zh/index';
export { zh_TW as epdVisualizationTranslationsZh_TW } from './zh_TW/index';
