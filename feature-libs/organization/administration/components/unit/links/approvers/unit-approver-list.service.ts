/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import {
  B2BUser,
  B2BUserRole,
  EntitiesModel,
  PaginationModel,
} from '@spartacus/core';
import {
  B2BUserService,
  OrganizationItemStatus,
  OrgUnitService,
} from '@spartacus/organization/administration/core';
import { TableService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { OrganizationTableType } from '../../../shared/organization.model';
import { SubListService } from '../../../shared/sub-list/sub-list.service';

@Injectable({
  providedIn: 'root',
})
export class UnitApproverListService extends SubListService<B2BUser> {
  protected tableType = OrganizationTableType.UNIT_APPROVERS;
  protected _domainType = OrganizationTableType.USER;

  constructor(
    protected tableService: TableService,
    protected unitService: OrgUnitService,
    protected userService: B2BUserService
  ) {
    super(tableService);
  }

  protected load(
    pagination: PaginationModel,
    code: string
  ): Observable<EntitiesModel<B2BUser> | undefined> {
    return this.unitService.getUsers(code, B2BUserRole.APPROVER, pagination);
  }

  /**
   * @override
   * Assign budget to the cost center.
   */
  assign(
    unitId: string,
    customerId: string
  ): Observable<OrganizationItemStatus<B2BUser>> {
    this.unitService.assignApprover(unitId, customerId, B2BUserRole.APPROVER);
    return this.userService.getLoadingStatus(customerId);
  }

  /**
   * @override
   * Unassign the budget from the cost center.
   */
  unassign(
    unitId: string,
    customerId: string
  ): Observable<OrganizationItemStatus<B2BUser>> {
    this.unitService.unassignApprover(unitId, customerId, B2BUserRole.APPROVER);
    return this.userService.getLoadingStatus(customerId);
  }
}
