/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { UnitListComponent } from '@spartacus/organization/administration/components';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { ListComponent } from '../../../administration/components/shared/list/list.component';
@Component({
  selector: 'cx-account-summary-list',
  templateUrl: './account-summary-list.component.html',
  standalone: true,
  imports: [ListComponent, TranslatePipe, MockTranslatePipe],
})
export class AccountSummaryListComponent extends UnitListComponent {}
