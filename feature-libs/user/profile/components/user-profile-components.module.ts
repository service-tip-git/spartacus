/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CloseAccountModule } from './close-account/close-account.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { RegisterComponentModule } from './register/register.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { UpdateEmailModule } from './update-email/update-email.module';
import { UpdatePasswordModule } from './update-password/update-password.module';
import { UpdateProfileModule } from './update-profile/update-profile.module';
import { AddressBookModule } from './address-book';
import { OneTimePasswordLoginRegisterModule } from './otp-login-register';
import { RegistrationVerificationTokenFormModule } from './registration-verification-token-form';

@NgModule({
  imports: [
    RegisterComponentModule,
    UpdateProfileModule,
    UpdateEmailModule,
    UpdatePasswordModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    CloseAccountModule,
    AddressBookModule,
    OneTimePasswordLoginRegisterModule,
    RegistrationVerificationTokenFormModule,
  ],
})
export class UserProfileComponentsModule {}
