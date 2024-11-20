/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckoutStep, CheckoutStepState } from '@spartacus/checkout/base/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutStepService } from '../services/checkout-step.service';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { MultiLinePipe } from './multiline-titles.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MultiLinePipe,
    MockTranslatePipe,
  ],
})
export class CheckoutProgressComponent {
  private _steps$: BehaviorSubject<CheckoutStep[]> =
    this.checkoutStepService.steps$;

  constructor(protected checkoutStepService: CheckoutStepService) {}

  activeStepIndex: number;
  activeStepIndex$: Observable<number> =
    this.checkoutStepService.activeStepIndex$.pipe(
      tap((index) => (this.activeStepIndex = index))
    );

  get steps$(): Observable<CheckoutStep[]> {
    return this._steps$.asObservable();
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
