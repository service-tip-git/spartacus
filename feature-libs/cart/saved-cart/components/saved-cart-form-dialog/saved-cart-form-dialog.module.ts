/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeaturesConfigModule, I18nModule } from '@spartacus/core';
import {
  FormErrorsModule,
  IconModule,
  KeyboardFocusModule,
} from '@spartacus/storefront';
import { SavedCartFormDialogComponent } from './saved-cart-form-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    FeaturesConfigModule,
  ],
  declarations: [SavedCartFormDialogComponent],
  exports: [SavedCartFormDialogComponent],
})
export class SavedCartFormDialogModule {}
