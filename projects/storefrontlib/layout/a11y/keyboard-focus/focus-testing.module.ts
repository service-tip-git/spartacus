/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Directive, Input, NgModule } from '@angular/core';
import { FocusConfig } from './keyboard-focus.model';

@Directive({
  selector: '[cxFocus]',
  standalone: false,
})
export class MockKeyboardFocusDirective {
  @Input('cxFocus') config: FocusConfig = {};
}

@NgModule({
  declarations: [MockKeyboardFocusDirective],
  exports: [MockKeyboardFocusDirective],
})
export class KeyboardFocusTestingModule {}
