/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { FocusDirective } from '../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';

export enum BIND_CART_DIALOG_ACTION {
  CANCEL = 'CANCEL',
  REPLACE = 'REPLACE',
}

@Component({
  selector: 'cx-asm-bind-cart-dialog',
  templateUrl: './asm-bind-cart-dialog.component.html',
  imports: [FocusDirective, TranslatePipe, MockTranslatePipe],
})
export class AsmBindCartDialogComponent {
  BIND_CART_ACTION = BIND_CART_DIALOG_ACTION;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: true,
    focusOnEscape: true,
  };

  constructor(protected launchDialogService: LaunchDialogService) {}

  closeModal(reason: BIND_CART_DIALOG_ACTION): void {
    this.launchDialogService.closeDialog(reason);
  }
}
