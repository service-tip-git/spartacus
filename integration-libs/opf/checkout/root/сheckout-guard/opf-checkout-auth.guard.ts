/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { GuardResult, UrlTree } from '@angular/router';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { FeatureConfigService, UserIdService } from '@spartacus/core';
import { combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { OpfCartUserEmailCheckerService } from '../services';

@Injectable({
  providedIn: 'root',
})
/**
 * A checkout authentication guard that extends `CheckoutAuthGuard` and applies additional logic for guest carts.
 * If the cart belongs to a guest user, it verifies whether the user has a valid email before allowing access.
 */
export class OpfCheckoutAuthGuard extends CheckoutAuthGuard {
  protected userIdService = inject(UserIdService);
  protected opfCartUserEmailChecker = inject(OpfCartUserEmailCheckerService);
  protected featureConfigService = inject(FeatureConfigService);

  /**
   * Determines whether the user can activate the checkout route.
   * - If the cart is **not a guest cart**, it defers to the parent `CheckoutAuthGuard`.
   * - If the cart **belongs to a guest user**, it checks whether the guest user has a valid email.
   * - If the guest user **does not have an email**, they are redirected to the OPF checkout login page.
   *
   * @returns {Observable<GuardResult>} - An observable that emits `true` to allow navigation, or a `UrlTree` to redirect the user.
   */
  canActivate(): Observable<GuardResult> {
    if (
      !this.featureConfigService?.isEnabled(
        'opfEnablePreventingFromCheckoutWithoutEmail'
      )
    ) {
      return super.canActivate();
    }

    return this.activeCartFacade.isStable().pipe(
      filter((isStable) => isStable),
      switchMap(() => this.activeCartFacade.isGuestCart()),
      switchMap((isGuestCart) => {
        if (!isGuestCart) {
          return super.canActivate();
        }

        return combineLatest([
          this.userIdService.getUserId(),
          this.activeCartFacade.getActiveCartId(),
        ]).pipe(
          switchMap(([userId, cartId]) => {
            return this.opfCartUserEmailChecker.isCartUserHasEmail(
              userId,
              cartId
            );
          }),
          map((isCartUserHasEmail) => {
            return isCartUserHasEmail || this.handleGuestUserWithoutEmail();
          })
        );
      })
    );
  }

  protected handleGuestUserWithoutEmail(): boolean | UrlTree {
    return this.router.createUrlTree([
      this.semanticPathService.get('opfCheckoutLogin'),
    ]);
  }
}
