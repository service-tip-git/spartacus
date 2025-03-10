/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostCenter } from '../../../model/org-unit.model';
import { UserCostCenterAdapter } from './user-cost-center.adapter';
import { EntitiesModel } from '../../../model/misc.model';

@Injectable({
  providedIn: 'root',
})
export class UserCostCenterConnector {
  constructor(protected adapter: UserCostCenterAdapter) {}

  getActiveList(userId: string): Observable<EntitiesModel<CostCenter>> {
    return this.adapter.loadActiveList(userId);
  }
}
