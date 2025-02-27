/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  LoadStatus,
  UserGroup,
} from '@spartacus/organization/administration/core';
import { filter, first, switchMap, take } from 'rxjs/operators';
import { ListService } from '../../shared/list/list.service';
import { SubListComponent } from '../../shared/sub-list/sub-list.component';
import { CurrentUserGroupService } from '../services/current-user-group.service';
import { UserGroupUserListService } from './user-group-user-list.service';

@Component({
  selector: 'cx-org-user-group-user-list',
  templateUrl: './user-group-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserGroupUserListService,
    },
  ],
  standalone: false,
})
export class UserGroupUserListComponent {
  constructor(
    protected currentUserGroupService: CurrentUserGroupService,
    protected userGroupUserListService: UserGroupUserListService
  ) {}

  @ViewChild('subList')
  subList: SubListComponent;

  unassignAll() {
    this.currentUserGroupService.key$
      .pipe(
        first(),
        switchMap((key) =>
          this.userGroupUserListService.unassignAllMembers(key).pipe(
            take(1),
            filter((data) => data.status === LoadStatus.SUCCESS)
          )
        )
      )
      .subscribe((data) => {
        this.notify(data.item);
      });
  }

  protected notify(item: UserGroup | undefined) {
    this.subList.messageService.add({
      message: {
        key: `orgUserGroupUsers.unassignAllConfirmation`,
        params: {
          item,
        },
      },
    });
  }
}
