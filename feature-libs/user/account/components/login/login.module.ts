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
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { DomChangeModule, PageSlotModule } from '@spartacus/storefront';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    PageSlotModule,
    I18nModule,
    DomChangeModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        LoginComponent: {
          component: LoginComponent,
        },
      },
    }),
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
