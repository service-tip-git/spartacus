/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import { KeyboardFocusModule } from '@spartacus/storefront';
import { ConfiguratorAttributeCompositionConfig } from '../../composition/configurator-attribute-composition.config';
import { ConfiguratorAttributeDropDownModule } from '../drop-down/configurator-attribute-drop-down.module';
import { ConfiguratorAttributeDropDownLazyLoadComponent } from './configurator-attribute-drop-down-lazy-load.component';
import { ConfiguratorAttributeReadOnlyModule } from '../read-only/configurator-attribute-read-only.module';

@NgModule({
  imports: [
    KeyboardFocusModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    ConfiguratorAttributeDropDownModule,
    ConfiguratorAttributeReadOnlyModule,
  ],
  providers: [
    provideDefaultConfig(<ConfiguratorAttributeCompositionConfig>{
      productConfigurator: {
        assignment: {
          AttributeType_dropdown_lazy:
            ConfiguratorAttributeDropDownLazyLoadComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorAttributeDropDownLazyLoadComponent],
  exports: [ConfiguratorAttributeDropDownLazyLoadComponent],
})
export class ConfiguratorAttributeDropDownLazyLoadModule {}
