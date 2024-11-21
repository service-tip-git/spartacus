/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  STATUS,
  STATUS_NAME,
  TicketEvent,
} from '@spartacus/customer-ticketing/root';
import { FormUtils } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { CustomerTicketingDialogComponent } from '../../../shared/customer-ticketing-dialog/customer-ticketing-dialog.component';
import { TranslatePipe } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';
import { FormErrorsComponent } from '@spartacus/storefront';
import { IconComponent } from '@spartacus/storefront';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusDirective } from '@spartacus/storefront';

@Component({
  selector: 'cx-customer-ticketing-close-dialog',
  templateUrl: './customer-ticketing-close-dialog.component.html',
  standalone: true,
  imports: [
    FocusDirective,
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
    FormErrorsComponent,
    NgIf,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CustomerTicketingCloseDialogComponent
  extends CustomerTicketingDialogComponent
  implements OnInit, OnDestroy
{
  subscription: Subscription;

  ngOnInit(): void {
    this.buildForm();
  }

  closeRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      FormUtils.deepUpdateValueAndValidity(this.form);
    } else {
      this.isDataLoading$.next(true);
      this.subscription = this.customerTicketingFacade
        .createTicketEvent(this.prepareTicketEvent())
        .subscribe({
          complete: () => {
            this.onComplete();
          },
          error: () => {
            this.onError();
          },
        });
    }
  }

  protected prepareTicketEvent(): TicketEvent {
    return {
      message: this.form?.get('message')?.value,
      toStatus: {
        id: STATUS.CLOSED,
        name: STATUS_NAME.CLOSED,
      },
    };
  }

  protected onComplete(): void {
    this.isDataLoading$.next(false);
    this.close('Ticket closed successfully');
    this.routingService.go({ cxRoute: 'supportTickets' });
  }

  protected onError(): void {
    this.close('Something went wrong while closing the ticket');
    this.isDataLoading$.next(false);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
