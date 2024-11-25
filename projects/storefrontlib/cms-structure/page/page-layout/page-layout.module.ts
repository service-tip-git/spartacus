/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageSlotModule } from '../../../cms-structure/page/slot/page-slot.module';
import { OutletModule } from '../../outlet/outlet.module';
import { PageLayoutComponent } from './page-layout.component';
import { PageTemplateDirective } from './page-template.directive';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    PageSlotModule,
    PageLayoutComponent,
    PageTemplateDirective,
  ],
  exports: [PageLayoutComponent, PageTemplateDirective],
})
export class PageLayoutModule {}
