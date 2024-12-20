/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './translations/index';
import { TranslationResources } from '@spartacus/core';
import {
  translationChunksConfig,
  translationsEn,
} from './translations/translations';

/**
 * @deprecated use **specific language** translations from `@spartacus/epd-visualization/assets` instead
 * like in the following example:
 *             ```ts
 *             import { translationsEn } from '@spartacus/epd-visualization/assets';
 *             ...
 *             {
 *                en: translationsEn
 *             }
 *             ```
 */
export const epdVisualizationTranslations: TranslationResources = {
  en: translationsEn,
};

/**
 * @deprecated use `translationChunksConfig` from `@spartacus/epd-visualization/assets` instead
 */
export const epdVisualizationTranslationChunksConfig = translationChunksConfig;
