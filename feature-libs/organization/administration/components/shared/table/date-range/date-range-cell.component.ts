/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import { FeatureConfigService } from '@spartacus/core';
import { CellComponent } from '../cell.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { CxDatePipe } from '../../../../../../../projects/core/src/i18n/date.pipe';
import { MockDatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-date.pipe';

@Component({
    selector: 'cx-org-date-range-cell',
    templateUrl: './date-range-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        RouterLink,
        NgTemplateOutlet,
        UrlPipe,
        CxDatePipe,
        MockDatePipe,
    ],
})
export class DateRangeCellComponent extends CellComponent {
  @Optional() featuteConfigService = inject(FeatureConfigService, {
    optional: true,
  });

  get linkable(): boolean {
    // TODO: (CXSPA-7155) - Remove feature flag next major release
    if (this.featuteConfigService?.isEnabled('a11yOrganizationLinkableCells')) {
      return this.hasRange && (this.cellOptions.linkable ?? false);
    }
    return this.hasRange && (this.cellOptions.linkable ?? true);
  }

  get hasRange(): boolean {
    return !!this.model.startDate && !!this.model.endDate;
  }
}
