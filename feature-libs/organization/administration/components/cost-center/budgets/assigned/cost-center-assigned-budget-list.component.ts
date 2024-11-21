/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../../shared/list/list.service';
import { CostCenterAssignedBudgetListService } from './cost-center-assigned-budget-list.service';
import { TranslatePipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { SubListComponent } from '../../../shared/sub-list/sub-list.component';

@Component({
  selector: 'cx-org-cost-center-assigned-budget-list',
  templateUrl: './cost-center-assigned-budget-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: CostCenterAssignedBudgetListService,
    },
  ],
  standalone: true,
  imports: [SubListComponent, RouterLink, TranslatePipe],
})
export class CostCenterAssignedBudgetListComponent {}
