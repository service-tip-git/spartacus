/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { DatePickerComponent } from './date-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    FeaturesConfigModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
