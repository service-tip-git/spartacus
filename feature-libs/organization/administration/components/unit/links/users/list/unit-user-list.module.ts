/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { DisableInfoModule } from '../../../../shared/detail/disable-info/disable-info.module';
import { SubListModule } from '../../../../shared/sub-list/sub-list.module';
import { UnitUserRolesCellComponent } from './unit-user-link-cell.component';
import { UnitUserListComponent } from './unit-user-list.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    RouterModule,
    UrlModule,
    SubListModule,
    DisableInfoModule,
    FeaturesConfigModule,
  ],
  declarations: [UnitUserListComponent, UnitUserRolesCellComponent],
})
export class UnitUserListModule {}
