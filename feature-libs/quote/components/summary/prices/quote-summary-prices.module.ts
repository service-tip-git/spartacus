/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { QuoteSummaryPricesComponent } from './quote-summary-prices.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [QuoteSummaryPricesComponent],
  exports: [QuoteSummaryPricesComponent],
})
export class QuoteSummaryPricesModule {}
