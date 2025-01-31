/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';

export const userProfileTranslations: TranslationResources = {
  en,
};

export const userProfileTranslationChunksConfig: TranslationChunksConfig = {
  userProfile: ['updateEmailForm', 'register', 'forgottenPassword'],
  myAccountV2UserProfile: ['myAccountV2UserProfile'],
  myAccountV2Email: ['myAccountV2Email'],
  myAccountV2Password: ['myAccountV2PasswordForm'],
  address: [
    'addressForm',
    'addressBook',
    'addressCard',
    'addressSuggestion',
    'addressMessages',
  ],
};
