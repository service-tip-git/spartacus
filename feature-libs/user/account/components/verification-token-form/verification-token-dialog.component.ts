/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { VERIFICATION_TOKEN_DIALOG_ACTION } from '@spartacus/user/account/root';
import { TranslatePipe } from '@spartacus/core';
import { FeatureDirective } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { FocusDirective } from '@spartacus/storefront';

@Component({
  selector: 'cx-verification-token-dialog',
  templateUrl: './verification-token-dialog.component.html',
  standalone: true,
  imports: [FocusDirective, IconComponent, FeatureDirective, TranslatePipe],
})
export class VerificationTokenDialogComponent {
  VERIFICATION_TOKEN_DIALOG_ACTION = VERIFICATION_TOKEN_DIALOG_ACTION;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: true,
    focusOnEscape: true,
  };

  constructor(protected launchDialogService: LaunchDialogService) {}

  closeModal(reason: VERIFICATION_TOKEN_DIALOG_ACTION): void {
    this.launchDialogService.closeDialog(reason);
  }
}
