/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { StoreSearchComponent } from './store-search.component';

@NgModule({
  imports: [CommonModule, I18nModule, FeaturesConfigModule],
  exports: [StoreSearchComponent],
  declarations: [StoreSearchComponent],
  providers: [],
})
export class StoreSearchModule {}
