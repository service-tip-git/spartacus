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
import { MockDatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
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
    TranslatePipe,
    MockDatePipe,
  ],
})
export class MyAccountV2CustomerTicketingComponent {
  protected readonly PAGE_SIZE = 1;
  protected customerTicketingFacade = inject(CustomerTicketingFacade);
  tickets$: Observable<TicketList | undefined> =
    this.customerTicketingFacade.getTickets(this.PAGE_SIZE);
}
