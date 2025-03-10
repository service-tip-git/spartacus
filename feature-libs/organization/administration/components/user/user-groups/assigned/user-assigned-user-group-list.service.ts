/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { EntitiesModel, PaginationModel } from '@spartacus/core';
import { UserGroup } from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrganizationTableType } from '../../../shared/organization.model';
import { UserUserGroupListService } from '../user-user-group-list.service';

@Injectable({
  providedIn: 'root',
})
export class UserAssignedUserGroupListService extends UserUserGroupListService {
  protected tableType = OrganizationTableType.USER_ASSIGNED_USER_GROUPS;

  protected load(
    pagination: PaginationModel,
    code: string
  ): Observable<EntitiesModel<UserGroup> | undefined> {
    return super.load(pagination, code).pipe(
      filter((list) => Boolean(list)),
      map((userGroups) => this.filterSelected(userGroups))
    );
  }
}
