/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationPreferenceComponent } from '../../notification-preference/notification-preference.component';

@Component({
  selector: 'cx-my-account-v2-notification-preference',
  templateUrl: './my-account-v2-notification-preference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MyAccountV2NotificationPreferenceComponent extends NotificationPreferenceComponent {}
