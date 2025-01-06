/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserEmailService } from './user-email.service';
import { UserPasswordService } from './user-password.service';
import { UserProfileService } from './user-profile.service';
import { UserRegisterService } from './user-register.service';
import {
  UserEmailFacade,
  UserPasswordFacade,
  UserProfileFacade,
  UserRegisterFacade,
} from '@spartacus/user/profile/root';
import { Provider } from '@angular/core';
import { RegistrationVerificationTokenService } from './registration-verification-token.service';
import { RegistrationVerificationTokenFacade } from 'feature-libs/user/profile/root/facade/registration-verification-token.facade';
export const facadeProviders: Provider[] = [
  UserEmailService,
  UserPasswordService,
  UserProfileService,
  UserRegisterService,
  {
    provide: UserEmailFacade,
    useExisting: UserEmailService,
  },
  {
    provide: UserPasswordFacade,
    useExisting: UserPasswordService,
  },
  {
    provide: UserProfileFacade,
    useExisting: UserProfileService,
  },
  {
    provide: UserRegisterFacade,
    useExisting: UserRegisterService,
  },
  RegistrationVerificationTokenService,
  {
    provide: RegistrationVerificationTokenFacade,
    useExisting: RegistrationVerificationTokenService,
  },
];
