/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../../shared/list/list.service';
import { UnitApproverListService } from './unit-approver-list.service';

@Component({
  selector: 'cx-org-unit-approver-list',
  templateUrl: './unit-approver-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UnitApproverListService,
    },
  ],
  standalone: false,
})
export class UnitApproverListComponent {}
