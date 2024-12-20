/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig } from './translation-chunks-config';

export { cs as translationsCs } from './cs/index';
export { de as translationsDe } from './de/index';
export { en as translationsEn } from './en/index';
export { es as translationsEs } from './es/index';
export { es_CO as translationsEs_CO } from './es_CO/index';
export { fr as translationsFr } from './fr/index';
export { hi as translationsHi } from './hi/index';
export { hu as translationsHu } from './hu/index';
export { id as translationsId } from './id/index';
export { it as translationsIt } from './it/index';
export { ja as translationsJa } from './ja/index';
export { ko as translationsKo } from './ko/index';
export { pl as translationsPl } from './pl/index';
export { pt as translationsPt } from './pt/index';
export { ru as translationsRu } from './ru/index';
export { zh as translationsZh } from './zh/index';
export { zh_TW as translationsZh_TW } from './zh_TW/index';

export const translationChunksConfig: TranslationChunksConfig = {
  common: [
    'common',
    'spinner',
    'searchBox',
    'navigation',
    'sorting',
    'httpHandlers',
    'pageMetaResolver',
    'miniCart',
    'skipLink',
    'formErrors',
    'errorHandlers',
    'carousel',
    'assistiveMessage',
    'passwordVisibility',
    'generalErrors',
    'chatMessaging',
    'formLegend',
  ],
  payment: [
    'paymentForm',
    'paymentMethods',
    'paymentCard',
    'paymentTypes',
    'paymentMessages',
  ],
  myAccount: [
    'orderDetails',
    'orderHistory',
    'closeAccount',
    'updatePasswordForm',
    'updateProfileForm',
    'consentManagementForm',
    'myCoupons',
    'notificationPreference',
    'myInterests',
    'AccountOrderHistoryTabContainer',
    'returnRequestList',
    'returnRequest',
  ],
  pwa: ['pwa'],
  product: [
    'productDetails',
    'productList',
    'productFacetNavigation',
    'productCarousel',
    'productSummary',
    'productReview',
    'addToCart',
    'addToWishList',
    'CMSTabParagraphContainer',
    'stockNotification',
    'TabPanelContainer',
    'itemCounter',
    'productView',
  ],
  user: ['anonymousConsents', 'loginRegister', 'checkoutLogin', 'authMessages'],
  video: ['player'],
  deliveryMode: ['setDeliveryMode'],
  myAccountV2NotifiationPerference: ['myAccountV2NotifiationPerference'],
  myAccountV2Consent: ['myAccountV2Consent'],
  siteThemeSwitcher: ['siteThemeSwitcher'],
};
