/*
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
import { BtnLikeLinkModule, PageSlotModule } from '@spartacus/storefront';
import { LoginRegisterComponent } from './login-register.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    PageSlotModule,
    I18nModule,
    FeaturesConfigModule,
    BtnLikeLinkModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ReturningCustomerRegisterComponent: {
          component: LoginRegisterComponent,
          guards: [NotAuthGuard],
        },
      },
    }),
  ],
  declarations: [LoginRegisterComponent],
})
export class LoginRegisterModule {}
