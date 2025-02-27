/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { QuoteFacade } from '@spartacus/quote/root';

@Component({
  selector: 'cx-quote-summary',
  templateUrl: 'quote-summary.component.html',
  standalone: false,
})
export class QuoteSummaryComponent {
  protected quoteFacade = inject(QuoteFacade);

  quoteDetails$ = this.quoteFacade.getQuoteDetails();
}
