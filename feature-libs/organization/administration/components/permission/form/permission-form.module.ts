/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { FormModule } from '../../shared/form/form.module';
import { ItemActiveModule } from '../../shared/item-active.module';
import { PermissionFormComponent } from './permission-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormModule,
    ItemActiveModule,
    FeaturesConfigModule,
  ],
  declarations: [PermissionFormComponent],
  exports: [PermissionFormComponent],
})
export class PermissionFormModule {}
