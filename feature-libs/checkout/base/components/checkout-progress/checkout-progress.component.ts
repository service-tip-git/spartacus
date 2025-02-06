/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutStep, CheckoutStepState } from '@spartacus/checkout/base/root';
import { BehaviorSubject, Observable } from 'rxjs';
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
  currency$ = new Observable<string>();
  language$ = new Observable<string>();

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
    this.currency$ = this.currencyService.getActive();
    this.language$ = this.languageService.getActive();
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
}
