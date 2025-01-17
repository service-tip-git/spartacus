/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  WindowRef,
} from '@spartacus/core';
import { ConfiguratorShowOptionsComponent } from './configurator-show-options.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ConfiguratorExitButton: {
          component: ConfiguratorShowOptionsComponent,
        },
      },
    }),
    WindowRef,
  ],
  declarations: [ConfiguratorShowOptionsComponent],
  exports: [ConfiguratorShowOptionsComponent],
})
export class ConfiguratorShowOptionsModule {}
