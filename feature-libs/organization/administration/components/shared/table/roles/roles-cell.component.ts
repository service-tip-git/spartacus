/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellComponent } from '../cell.component';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgTemplateOutlet, NgFor } from '@angular/common';

@Component({
  selector: 'cx-org-roles-cell',
  templateUrl: './roles-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    NgFor,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class RolesCellComponent extends CellComponent {}
