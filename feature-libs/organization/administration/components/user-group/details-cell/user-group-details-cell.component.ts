/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CellComponent } from '../../shared';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { PopoverDirective } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-org-user-group-details-cell',
  templateUrl: './user-group-details-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, PopoverDirective, TranslatePipe, UrlPipe],
})
export class UserGroupDetailsCellComponent extends CellComponent {}
