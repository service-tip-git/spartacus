/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FeatureConfigService,
  GlobalMessageService,
  GlobalMessageType,
  HttpErrorModel,
  TranslationService,
} from '@spartacus/core';
import {
  AssociatedObject,
  Category,
  MAX_ENTRIES_FOR_ATTACHMENT,
  TicketDetails,
  TicketStarter,
} from '@spartacus/customer-ticketing/root';
import { FormUtils } from '@spartacus/storefront';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { CustomerTicketingDialogComponent } from '../../../shared/customer-ticketing-dialog/customer-ticketing-dialog.component';

@Component({
  selector: 'cx-customer-ticketing-create-dialog',
  templateUrl: './customer-ticketing-create-dialog.component.html',
  standalone: false,
})
export class CustomerTicketingCreateDialogComponent
  extends CustomerTicketingDialogComponent
  implements OnInit, OnDestroy
{
  ticketCategories$: Observable<Category[] | undefined> =
    this.customerTicketingFacade.getTicketCategories().pipe(
      tap((categories: Category[] | undefined) => {
        this.manageCategoryValidation(categories);
      })
    );
  ticketAssociatedObjects$: Observable<AssociatedObject[]> =
    this.customerTicketingFacade.getTicketAssociatedObjects().pipe(
      map((ao) =>
        ao.map((cao) => ({
          ...cao,
          label: `${cao.type} ${cao.code}`,
        }))
      ),
      catchError((error: any) => {
        this.handleError(error);
        return of([]);
      })
    );
  subscription: Subscription;

  @Input()
  selectedCategory: Category;

  @Input()
  selectedAssociatedObject: AssociatedObject;

  attachment: File;

  protected globalMessage = inject(GlobalMessageService);

  protected translationService = inject(TranslationService);

  protected featureService = inject(FeatureConfigService, { optional: true });

  protected getCreateTicketPayload(form: FormGroup): TicketStarter {
    return {
      message: form?.get('message')?.value,
      subject: form?.get('subject')?.value,
      associatedTo: form?.get('associatedTo')?.value || undefined,
      ticketCategory: form?.get('ticketCategory')?.value,
    };
  }

  ngOnInit(): void {
    this.buildForm();

    if (
      this.featureService?.isEnabled(
        'a11ySelectImprovementsCustomerTicketingCreateSelectbox'
      )
    ) {
      this.focusConfig.trap = false;
      this.focusConfig.trapTabOnly = true;
    }
  }

  protected buildForm(): void {
    const form = new FormGroup({});
    form.setControl(
      'subject',
      new FormControl('', [
        Validators.required,
        Validators.maxLength(this.inputCharactersForSubject),
      ])
    );
    form.setControl(
      'ticketCategory',
      new FormControl('', [Validators.required])
    );
    form.setControl('associatedTo', new FormControl(''));
    form.setControl(
      'message',
      new FormControl('', [
        Validators.required,
        Validators.maxLength(this.inputCharactersLimit),
      ])
    );
    form.setControl(
      'file',
      new FormControl('', [
        this.filesFormValidators.maxSize(this.maxSize),
        this.filesFormValidators.maxEntries(MAX_ENTRIES_FOR_ATTACHMENT),
        this.filesFormValidators.allowedTypes(this.allowedTypes),
      ])
    );
    this.form = form;
  }

  createTicketRequest(): void {
    this.attachment = this.form.get('file')?.value?.[0];
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      FormUtils.deepUpdateValueAndValidity(this.form);
    } else {
      this.subscription = this.customerTicketingFacade
        .createTicket(this.getCreateTicketPayload(this.form))
        .subscribe({
          next: (response: TicketDetails) => {
            if (
              response.id &&
              this.attachment &&
              response.ticketEvents?.[0].code
            ) {
              this.customerTicketingFacade.uploadAttachment(
                this.attachment,
                response.ticketEvents?.[0].code,
                response.id
              );
            }
          },
          complete: () => {
            this.onComplete();
          },
          error: (error: any) => {
            this.handleError(error);
          },
        });
    }
  }

  protected handleError(error: any): void {
    if (error instanceof HttpErrorModel) {
      (error.details ?? []).forEach((err) => {
        if (err.message) {
          this.globalMessage.add(
            { raw: err.message },
            GlobalMessageType.MSG_TYPE_ERROR
          );
        }
      });
    } else {
      this.translationService
        .translate('httpHandlers.unknownError')
        .pipe(first())
        .subscribe((text) => {
          this.globalMessage.add(
            { raw: text },
            GlobalMessageType.MSG_TYPE_ERROR
          );
        });
    }
    this.onError();
  }

  protected manageCategoryValidation(categories: Category[] | undefined): void {
    const categoryControl = this.form.get('ticketCategory');
    if (!categoryControl) {
      return;
    }
    if (categories?.length) {
      categoryControl.setValidators(Validators.required);
      categoryControl.updateValueAndValidity();
    } else {
      categoryControl.clearValidators();
      categoryControl.updateValueAndValidity();
    }
  }

  protected onComplete(): void {
    this.close('Ticket created successfully');
  }

  protected onError(): void {
    this.close('Something went wrong');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
