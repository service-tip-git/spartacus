/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { NavigationComponent } from '../../../navigation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cx-my-account-v2-navigation',
  templateUrl: './my-account-v2-navigation.component.html',
})
export class MyAccountV2NavigationComponent extends NavigationComponent {
  navAriaLabel$: Observable<any> = this.name$.pipe(
    map((name: any) => name ?? 'MyAccount View Side Navigation')
  );
}
