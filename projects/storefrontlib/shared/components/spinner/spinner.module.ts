/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { I18nModule } from '@spartacus/core';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
