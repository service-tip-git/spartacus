/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { BaseMessageComponent } from '../base-message.component';
import { TranslatePipe } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { NgIf } from '@angular/common';
import { FocusDirective } from '@spartacus/storefront';

@Component({
  selector: 'cx-org-notification',
  templateUrl: './notification-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FocusDirective, NgIf, IconComponent, TranslatePipe, TranslatePipe],
})
export class NotificationMessageComponent extends BaseMessageComponent {
  closeIcon = ICON_TYPE.CLOSE;
}
