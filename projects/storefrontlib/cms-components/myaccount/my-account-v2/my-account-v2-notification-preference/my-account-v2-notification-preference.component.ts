/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationPreferenceComponent } from '../../notification-preference/notification-preference.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-my-account-v2-notification-preference',
  templateUrl: './my-account-v2-notification-preference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class MyAccountV2NotificationPreferenceComponent extends NotificationPreferenceComponent {}
