/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../../shared/list/list.service';
import { UserGroupAssignedUserListService } from './user-group-assigned-user-list.service';

@Component({
  selector: 'cx-org-user-group-assigned-user-list',
  templateUrl: './user-group-assigned-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserGroupAssignedUserListService,
    },
  ],
  standalone: false,
})
export class UserGroupAssignedUserListComponent {}
