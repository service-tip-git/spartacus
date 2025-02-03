/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { GuardResult, UrlTree } from '@angular/router';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { UserIdService } from '@spartacus/core';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { OpfCartUserEmailCheckerService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class OpfCheckoutAuthGuard extends CheckoutAuthGuard {
  protected userIdService = inject(UserIdService);
  protected opfCartUserEmailChecker = inject(OpfCartUserEmailCheckerService);

  canActivate(): Observable<GuardResult> {
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
            console.log('test', userId, cartId);
            return this.opfCartUserEmailChecker.isCartUserHasEmail(
              userId,
              cartId
            );
          }),
          tap((val) => console.log(val)),
          map((isCartUserHasEmail) => {
            return isCartUserHasEmail || this.handleGuestUserWithoutEmail();
          })
        );
      })
    );
  }

  protected handleGuestUserWithoutEmail(): boolean | UrlTree {
    this.authRedirectService.saveCurrentNavigationUrl();

    return this.router.createUrlTree([
      this.semanticPathService.get('opfCheckoutLogin'),
    ]);
  }
}
