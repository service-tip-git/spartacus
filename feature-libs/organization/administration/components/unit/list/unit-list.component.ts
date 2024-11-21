/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrgUnitService } from '@spartacus/organization/administration/core';
import { UnitTreeService } from '../services/unit-tree.service';
import { TranslatePipe } from '@spartacus/core';
import { ListComponent } from '../../shared/list/list.component';

@Component({
  selector: 'cx-org-unit-list',
  templateUrl: './unit-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ListComponent, TranslatePipe, TranslatePipe],
})
export class UnitListComponent {
  constructor(
    protected unitTreeService: UnitTreeService,
    protected orgUnitService?: OrgUnitService
  ) {}

  readonly isUpdatingUnitAllowed = this.orgUnitService
    ? this.orgUnitService.isUpdatingUnitAllowed()
    : true;

  expandAll() {
    this.unitTreeService.expandAll();
  }

  collapseAll() {
    this.unitTreeService.collapseAll();
  }
}
