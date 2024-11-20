/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../shared/list/list.service';
import { CostCenterBudgetListService } from './cost-center-budget-list.service';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { SubListComponent } from '../../shared/sub-list/sub-list.component';

@Component({
  selector: 'cx-org-cost-center-budget-list',
  templateUrl: './cost-center-budget-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: CostCenterBudgetListService,
    },
  ],
  standalone: true,
  imports: [SubListComponent, RouterLink, TranslatePipe, MockTranslatePipe],
})
export class CostCenterBudgetListComponent {}
