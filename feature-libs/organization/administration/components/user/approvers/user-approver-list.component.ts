/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../shared/list/list.service';
import { UserApproverListService } from './user-approver-list.service';

@Component({
  selector: 'cx-org-user-approver-list',
  templateUrl: './user-approver-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserApproverListService,
    },
  ],
  standalone: false,
})
export class UserApproverListComponent {}
