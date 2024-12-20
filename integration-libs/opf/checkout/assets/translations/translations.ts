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
 *             -   resources: opfCheckoutTranslations
 *             +   resources: { en: opfCheckoutTranslationsEn }
 *               }
 *             ```
 */
export const opfCheckoutTranslations = {
  en,
};

export { en as opfCheckoutTranslationsEn } from './en/index';
