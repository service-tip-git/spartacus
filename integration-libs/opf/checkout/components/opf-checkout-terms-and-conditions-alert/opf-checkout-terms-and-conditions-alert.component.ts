/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-opf-checkout-terms-and-conditions-alert',
  templateUrl: './opf-checkout-terms-and-conditions-alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpfCheckoutTermsAndConditionsAlertComponent {
  iconTypes = ICON_TYPE;

  @Input() isVisible: boolean;
  /**
   * Explicit Terms and Conditions (isExplicit true) requires user to accept T&C to see and select payments options.
   * Implicit Terms and Conditions (isExplicit false) only displays the T&C message without checkbox, payment options are always enabled.
   */
  @Input() isExplicit: boolean | undefined | null;

  close() {
    this.isVisible = false;
  }
}
