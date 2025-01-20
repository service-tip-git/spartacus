/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserIdService } from '@spartacus/core';
import {
  B2BUserService,
  StateWithOrganization,
} from '@spartacus/organization/administration/core';

let CDC_B2BUserService_count = 0;

@Injectable({
  providedIn: 'root',
})
export class CdcB2BUserService extends B2BUserService {
  CDC_B2BUserService_count = ++CDC_B2BUserService_count;

  constructor(
    protected store: Store<StateWithOrganization>,
    protected userIdService: UserIdService,
    protected injector: Injector
  ) {
    super(store, userIdService, injector);
    console.log({
      CdcB2BUserService: this,
    });
  }

  isUpdatingUserAllowed(): boolean {
    return false;
  }
}
