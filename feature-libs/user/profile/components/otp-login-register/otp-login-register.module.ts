/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  NotAuthGuard,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  BtnLikeLinkModule,
  CaptchaModule,
  FormErrorsModule,
  NgSelectA11yModule,
  PageSlotModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { OneTimePasswordLoginRegisterComponent } from './otp-login-register.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OneTimePasswordLoginRegisterComponentService } from './otp-register-component.service';
import { UserRegisterFacade } from '../../root/facade';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    PageSlotModule,
    I18nModule,
    FeaturesConfigModule,
    BtnLikeLinkModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgSelectA11yModule,
    CaptchaModule,
    SpinnerModule,
    FormErrorsModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ReturningCustomerOTPRegisterComponent: {
          component: OneTimePasswordLoginRegisterComponent,
          guards: [NotAuthGuard],
          providers: [
            {
              provide: OneTimePasswordLoginRegisterComponentService,
              useClass: OneTimePasswordLoginRegisterComponentService,
              deps: [UserRegisterFacade, UntypedFormBuilder],
            },
          ],
        },
      },
    }),
  ],
  declarations: [OneTimePasswordLoginRegisterComponent],
})
export class OneTimePasswordLoginRegisterModule {}
