/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { KeyboardFocusModule } from '../../../../layout/a11y/keyboard-focus/keyboard-focus.module';
import { OutletModule } from '../../../../cms-structure/outlet/outlet.module';
import { PageComponentModule } from '../../../../cms-structure/page/component/page-component.module';
import { TabPanelComponent } from './tab-panel.component';

@NgModule({
  imports: [
    CommonModule,
    PageComponentModule,
    OutletModule,
    I18nModule,
    KeyboardFocusModule,
  ],
  declarations: [TabPanelComponent],
  exports: [TabPanelComponent],
})
export class TabPanelModule {}
