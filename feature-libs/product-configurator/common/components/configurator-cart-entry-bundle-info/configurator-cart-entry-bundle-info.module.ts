/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { I18nModule } from '@spartacus/core';
import { OutletPosition, provideOutlet } from '@spartacus/storefront';
import { ConfigureCartEntryModule } from '../configure-cart-entry/configure-cart-entry.module';
import { ConfiguratorCartEntryBundleInfoComponent } from './configurator-cart-entry-bundle-info.component';

@NgModule({
  imports: [CommonModule, I18nModule, ConfigureCartEntryModule],
  declarations: [ConfiguratorCartEntryBundleInfoComponent],

  providers: [
    provideOutlet({
      id: CartOutlets.ITEM_BUNDLE_DETAILS,
      position: OutletPosition.AFTER,
      component: ConfiguratorCartEntryBundleInfoComponent,
    }),
  ],
})
export class ConfiguratorCartEntryBundleInfoModule {}
