/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellComponent } from '../cell.component';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'cx-org-status-cell',
  templateUrl: './status-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StatusCellComponent extends CellComponent {
  get label() {
    if (this.isActive === undefined) {
      return;
    }
    return this.isActive ? 'organization.enabled' : 'organization.disabled';
  }

  get isActive(): boolean {
    return this.model.active;
  }
}
