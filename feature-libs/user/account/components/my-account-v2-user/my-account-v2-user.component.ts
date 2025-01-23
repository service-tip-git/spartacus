/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { LoginComponent } from '../login';

@Component({
  selector: 'cx-my-account-v2-user',
  templateUrl: './my-account-v2-user.component.html',
  standalone: false,
})
export class MyAccountV2UserComponent extends LoginComponent {}
