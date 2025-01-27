/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesConfigModule, I18nModule } from '@spartacus/core';
import {
  IconModule,
  KeyboardFocusModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { StoreListModule } from '../store-list/index';
import { StoreSearchModule } from '../store-search/index';
import { PickupOptionDialogComponent } from './pickup-option-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    SpinnerModule,
    StoreListModule,
    StoreSearchModule,
    FeaturesConfigModule,
  ],
  declarations: [PickupOptionDialogComponent],
  exports: [PickupOptionDialogComponent],
})
export class PickupOptionDialogModule {}
