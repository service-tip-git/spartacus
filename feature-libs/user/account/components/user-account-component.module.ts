/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { LoginFormModule } from './login-form/login-form.module';
import { LoginRegisterModule } from './login-register/login-register.module';
import { LoginModule } from './login/login.module';
import { MyAccountV2UserModule } from './my-account-v2-user';
import { OneTimePasswordLoginFormModeule } from './otp-login-form/otp-login-form.module';
import { VerificationTokenFormModule } from './verification-token-form/verification-token-form.module';

@NgModule({
  imports: [
    LoginModule,
    LoginFormModule,
    VerificationTokenFormModule,
    LoginRegisterModule,
    MyAccountV2UserModule,
    OneTimePasswordLoginFormModeule,
  ],
})
export class UserAccountComponentsModule {}
