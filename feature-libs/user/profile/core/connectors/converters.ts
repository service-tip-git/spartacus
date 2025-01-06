/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { User } from '@spartacus/user/account/root';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenCreation,
  Title,
  UserSignUp,
} from '@spartacus/user/profile/root';

export const USER_PROFILE_NORMALIZER = new InjectionToken<Converter<User, any>>(
  'UserProfileNormalizer'
);

export const USER_PROFILE_SERIALIZER = new InjectionToken<Converter<User, any>>(
  'UserProfileSerializer'
);

export const USER_SERIALIZER = new InjectionToken<Converter<User, any>>(
  'UserSerializer'
);

export const USER_SIGN_UP_SERIALIZER = new InjectionToken<
  Converter<UserSignUp, any>
>('UserSignUpSerializer');

export const TITLE_NORMALIZER = new InjectionToken<Converter<any, Title>>(
  'TitleNormalizer'
);

export const REGISTRATION_FORM_SERIALIZER = new InjectionToken<
  Converter<RegistrationVerificationTokenCreation, any>
>('RegistrationFormSerializer');

export const VERIFICATION_TOKEN_NORMALIZER = new InjectionToken<
  Converter<any, RegistrationVerificationToken>
>('VerificationTokenNormalizer');
