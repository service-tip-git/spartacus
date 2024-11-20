/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../shared/list/list.service';
import { UserPermissionListService } from './user-permission-list.service';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { RouterLink } from '@angular/router';
import { SubListComponent } from '../../shared/sub-list/sub-list.component';

@Component({
  selector: 'cx-org-user-permission-list',
  templateUrl: './user-permission-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserPermissionListService,
    },
  ],
  standalone: true,
  imports: [SubListComponent, RouterLink, TranslatePipe, MockTranslatePipe],
})
export class UserPermissionListComponent {}
