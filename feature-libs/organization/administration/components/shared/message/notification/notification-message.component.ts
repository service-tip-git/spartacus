/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { BaseMessageComponent } from '../base-message.component';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { IconComponent } from '../../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { NgIf } from '@angular/common';
import { FocusDirective } from '../../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-org-notification',
  templateUrl: './notification-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FocusDirective,
    NgIf,
    IconComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class NotificationMessageComponent extends BaseMessageComponent {
  closeIcon = ICON_TYPE.CLOSE;
}
