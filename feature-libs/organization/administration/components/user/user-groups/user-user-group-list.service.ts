/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { EntitiesModel, PaginationModel } from '@spartacus/core';
import {
  B2BUserService,
  OrganizationItemStatus,
  UserGroup,
  UserGroupService,
} from '@spartacus/organization/administration/core';
import { TableService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { OrganizationTableType } from '../../shared/organization.model';
import { SubListService } from '../../shared/sub-list/sub-list.service';

@Injectable({
  providedIn: 'root',
})
export class UserUserGroupListService extends SubListService<UserGroup> {
  protected tableType = OrganizationTableType.USER_USER_GROUPS;
  protected _domainType = OrganizationTableType.USER_GROUP;

  constructor(
    protected tableService: TableService,
    protected userService: B2BUserService,
    protected userGroupService: UserGroupService
  ) {
    super(tableService);
  }

  protected load(
    pagination: PaginationModel,
    code: string
  ): Observable<EntitiesModel<UserGroup> | undefined> {
    return this.userService.getUserGroups(code, pagination);
  }

  /**
   * @override
   * Assign user group to the user.
   */
  assign(
    userCode: string,
    userGroupCode: string
  ): Observable<OrganizationItemStatus<UserGroup>> {
    this.userService.assignUserGroup(userCode, userGroupCode);
    return this.userGroupService.getLoadingStatus(userGroupCode);
  }

  /**
   * @override
   * Unassign the user group from the user.
   */
  unassign(
    userCode: string,
    userGroupCode: string
  ): Observable<OrganizationItemStatus<UserGroup>> {
    this.userService.unassignUserGroup(userCode, userGroupCode);
    return this.userGroupService.getLoadingStatus(userGroupCode);
  }
}
