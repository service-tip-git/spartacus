/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { VERIFICATION_TOKEN_DIALOG_ACTION } from '@spartacus/user/account/root';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { FocusDirective } from '../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-verification-token-dialog',
  templateUrl: './verification-token-dialog.component.html',
  standalone: true,
  imports: [
    FocusDirective,
    IconComponent,
    FeatureDirective,
    TranslatePipe,
    MockTranslatePipe,
  ],
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
