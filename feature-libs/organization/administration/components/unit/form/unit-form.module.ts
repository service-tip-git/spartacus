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
import { FormErrorsModule, NgSelectA11yModule } from '@spartacus/storefront';
import { FormModule } from '../../shared/form/form.module';
import { ItemActiveModule } from '../../shared/item-active.module';
import { UnitFormComponent } from './unit-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormModule,
    NgSelectModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ItemActiveModule,
    FeaturesConfigModule,
    NgSelectA11yModule,
  ],
  declarations: [UnitFormComponent],
  exports: [UnitFormComponent],
})
export class UnitFormModule {}
