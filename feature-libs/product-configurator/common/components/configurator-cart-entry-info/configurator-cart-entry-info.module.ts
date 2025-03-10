/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  IconModule,
  OutletPosition,
  provideOutlet,
} from '@spartacus/storefront';
import { ConfiguratorIssuesNotificationModule } from '../configurator-issues-notification/configurator-issues-notification.module';
import { ConfigureCartEntryModule } from '../configure-cart-entry/configure-cart-entry.module';
import { ConfiguratorCartEntryInfoComponent } from './configurator-cart-entry-info.component';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    IconModule,
    ConfiguratorIssuesNotificationModule,
    ConfigureCartEntryModule,
  ],
  declarations: [ConfiguratorCartEntryInfoComponent],

  providers: [
    provideOutlet({
      id: CartOutlets.ITEM_DETAILS,
      position: OutletPosition.AFTER,
      component: ConfiguratorCartEntryInfoComponent,
    }),
  ],
})
export class ConfiguratorCartEntryInfoModule {}
