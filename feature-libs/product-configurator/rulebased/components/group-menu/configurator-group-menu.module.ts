/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { IconModule, KeyboardFocusModule } from '@spartacus/storefront';
import { ConfiguratorGroupMenuComponent } from './configurator-group-menu.component';

@NgModule({
    imports: [CommonModule, I18nModule, IconModule, KeyboardFocusModule, ConfiguratorGroupMenuComponent],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                ConfiguratorMenu: {
                    component: ConfiguratorGroupMenuComponent,
                },
            },
        }),
    ],
    exports: [ConfiguratorGroupMenuComponent],
})
export class ConfiguratorGroupMenuModule {}
