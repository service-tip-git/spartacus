/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutStep, CheckoutStepState } from '@spartacus/checkout/base/root';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutStepService } from '../services/checkout-step.service';
import { Router } from '@angular/router';
import { CurrencyService, LanguageService } from '@spartacus/core';

@Component({
  selector: 'cx-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CheckoutProgressComponent implements OnInit {
  private _steps$: BehaviorSubject<CheckoutStep[]> =
    this.checkoutStepService.steps$;
  currency: string | undefined;
  language: string | undefined;

  constructor(
    protected checkoutStepService: CheckoutStepService,
    protected route: Router,
    protected currencyService: CurrencyService,
    protected languageService: LanguageService
  ) {}

  activeStepIndex: number;
  activeStepIndex$: Observable<number> =
    this.checkoutStepService.activeStepIndex$.pipe(
      tap((index) => (this.activeStepIndex = index))
    );

  get steps$(): Observable<CheckoutStep[]> {
    return this._steps$.asObservable();
  }

  ngOnInit(): void {
    this.setLanguageAndCurrency();
  }

  getTabIndex(stepIndex: number): number {
    return !this.isActive(stepIndex) && !this.isDisabled(stepIndex) ? 0 : -1;
  }

  isActive(index: number): boolean {
    return index === this.activeStepIndex;
  }

  isDisabled(index: number): boolean {
    return index > this.activeStepIndex;
  }

  getStepState(index: number): CheckoutStepState {
    if (this.isDisabled(index)) {
      return CheckoutStepState.DISABLED;
    }
    if (this.isActive(index)) {
      return CheckoutStepState.SELECTED;
    }
    return CheckoutStepState.COMPLETED;
  }

  setNavUrl(routeName: string): string {
    const segments = this.route.url.split('/').filter((s) => !!s);

    if (!this.currency || !this.language) {
      return '';
    }

    const baseUrl = `/${segments[0]}/${this.language}/${this.currency}/checkout`;

    switch (routeName) {
      case 'checkoutDeliveryAddress':
        return `${baseUrl}/delivery-address`;
      case 'checkoutPaymentDetails':
        return `${baseUrl}/payment-details`;
      case 'checkoutReviewOrder':
        return `${baseUrl}/review-order`;
      case 'checkoutDeliveryMode':
        return `${baseUrl}/delivery-mode`;
      default:
        return baseUrl;
    }
  }

  setLanguageAndCurrency(): void {
    combineLatest([
      this.currencyService.getActive(),
      this.languageService.getActive(),
    ]).subscribe(([currency, language]) => {
      this.currency = currency;
      this.language = language;
    });
  }
}
