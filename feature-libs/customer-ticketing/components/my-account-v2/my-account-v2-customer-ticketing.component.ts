/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject } from '@angular/core';
import {
  CustomerTicketingFacade,
  TicketList,
} from '@spartacus/customer-ticketing/root';
import { Observable } from 'rxjs';
import { MockDatePipe } from '../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { UrlPipe } from '../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { CxDatePipe } from '../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { SpinnerComponent } from '../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-my-account-v2-customer-ticketing',
  templateUrl: './my-account-v2-customer-ticketing.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    CxDatePipe,
    UrlPipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class MyAccountV2CustomerTicketingComponent {
  protected readonly PAGE_SIZE = 1;
  protected customerTicketingFacade = inject(CustomerTicketingFacade);
  tickets$: Observable<TicketList | undefined> =
    this.customerTicketingFacade.getTickets(this.PAGE_SIZE);
}
