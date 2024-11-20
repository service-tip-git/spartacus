/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CellComponent } from '../../shared';
import { MockDatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { UrlPipe } from '../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { CxDatePipe } from '../../../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { PopoverDirective } from '../../../../../../projects/storefrontlib/shared/components/popover/popover.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-org-budget-details-cell',
  templateUrl: './budget-details-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    PopoverDirective,
    TranslatePipe,
    CxDatePipe,
    UrlPipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class BudgetDetailsCellComponent extends CellComponent {}
