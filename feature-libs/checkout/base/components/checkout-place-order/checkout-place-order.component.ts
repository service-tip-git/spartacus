/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CurrencyService,
  LanguageService,
  RoutingService,
} from '@spartacus/core';
import { OrderFacade } from '@spartacus/order/root';
import { LaunchDialogService, LAUNCH_CALLER } from '@spartacus/storefront';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'cx-place-order',
  templateUrl: './checkout-place-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CheckoutPlaceOrderComponent implements OnDestroy, OnInit {
  placedOrder: void | Observable<ComponentRef<any> | undefined>;
  currency: string;
  termsAndConditionUrl$ = new BehaviorSubject<string>('');
  private currency$ = this.currencyService.getActive();
  private language$ = this.languageService.getActive();

  checkoutSubmitForm: UntypedFormGroup = this.fb.group({
    termsAndConditions: [false, Validators.requiredTrue],
  });

  get termsAndConditionInvalid(): boolean {
    return this.checkoutSubmitForm.invalid;
  }

  constructor(
    protected orderFacade: OrderFacade,
    protected routingService: RoutingService,
    protected fb: UntypedFormBuilder,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected route: Router,
    protected currencyService: CurrencyService,
    protected languageService: LanguageService
  ) {}

  ngOnInit() {
    this.setTermsOfConditionUrl();
  }

  submitForm(): void {
    if (this.checkoutSubmitForm.valid) {
      this.placedOrder = this.launchDialogService.launch(
        LAUNCH_CALLER.PLACE_ORDER_SPINNER,
        this.vcr
      );
      this.orderFacade.placeOrder(this.checkoutSubmitForm.valid).subscribe({
        error: () => {
          if (!this.placedOrder) {
            return;
          }

          this.placedOrder
            .subscribe((component) => {
              this.launchDialogService.clear(LAUNCH_CALLER.PLACE_ORDER_SPINNER);
              if (component) {
                component.destroy();
              }
            })
            .unsubscribe();
        },
        next: () => this.onSuccess(),
      });
    } else {
      this.checkoutSubmitForm.markAllAsTouched();
    }
  }

  onSuccess(): void {
    this.routingService.go({ cxRoute: 'orderConfirmation' });
  }

  setTermsOfConditionUrl(): void {
    combineLatest([this.currency$, this.language$]).subscribe(
      ([currency, language]) => {
        const segments = this.route.url.split('/').filter((s) => !!s);
        const url = `/${segments[0]}/${language}/${currency}/terms-and-conditions`;
        this.termsAndConditionUrl$.next(url);
      }
    );
  }

  ngOnDestroy(): void {
    this.launchDialogService.clear(LAUNCH_CALLER.PLACE_ORDER_SPINNER);
  }
}
