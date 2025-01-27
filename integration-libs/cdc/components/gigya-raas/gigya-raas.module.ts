/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { LayoutConfig } from '@spartacus/storefront';
import { GigyaRaasComponent } from './gigya-raas.component';
import { GigyaRaasGuard } from './gigya-raas.guard';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig | LayoutConfig>{
      cmsComponents: {
        GigyaRaasComponent: {
          component: GigyaRaasComponent,
          guards: [GigyaRaasGuard],
        },
      },
      layoutSlots: {
        GigyaLoginPageTemplate: {
          slots: ['BodyContent', 'BottomContent'],
        },
      },
    }),
  ],
  declarations: [GigyaRaasComponent],
  exports: [GigyaRaasComponent],
})
export class GigyaRaasModule {}
