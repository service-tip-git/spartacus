/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormErrorsModule, I18nModule],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
