/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import {
  ActiveCartFacade,
  CartGuestUserFacade,
  MultiCartFacade,
} from '@spartacus/cart/base/root';
import { CheckoutConfig } from '@spartacus/checkout/base/root';
import { AuthService, UserIdService } from '@spartacus/core';
import {
  ActiveConfiguration,
  OpfBaseFacade,
  OpfPaymentProviderType,
} from '@spartacus/opf/base/root';
import {
  OpfProviderType,
  OpfQuickBuyDigitalWallet,
} from '@spartacus/opf/quick-buy/root';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class OpfQuickBuyButtonsService {
  protected opfBaseFacade = inject(OpfBaseFacade);
  protected checkoutConfig = inject(CheckoutConfig);
  protected authService = inject(AuthService);
  protected userIdService = inject(UserIdService);
  protected cartGuestUserFacade = inject(CartGuestUserFacade);
  protected activeCartFacade = inject(ActiveCartFacade);
  protected multiCartFacade = inject(MultiCartFacade);

  getPaymentGatewayConfiguration(): Observable<ActiveConfiguration> {
    return this.opfBaseFacade
      .getActiveConfigurationsState()
      .pipe(
        map(
          (config) =>
            (config?.data || []).filter(
              (item) =>
                item?.providerType === OpfPaymentProviderType.PAYMENT_GATEWAY
            )[0]
        )
      );
  }

  getQuickBuyProviderConfig(
    provider: OpfProviderType,
    activeConfiguration: ActiveConfiguration
  ): OpfQuickBuyDigitalWallet | undefined {
    let config;
    if (activeConfiguration && activeConfiguration.digitalWalletQuickBuy) {
      config = activeConfiguration?.digitalWalletQuickBuy.find(
        (item) => item.provider === provider
      );
    }

    return config;
  }

  isQuickBuyProviderEnabled(
    provider: OpfProviderType,
    activeConfiguration: ActiveConfiguration
  ): boolean {
    let isEnabled = false;
    if (activeConfiguration && activeConfiguration.digitalWalletQuickBuy) {
      isEnabled = Boolean(
        activeConfiguration?.digitalWalletQuickBuy.find(
          (item) => item.provider === provider
        )?.enabled
      );
    }

    return isEnabled;
  }

  /**
   * Checks whether the cart belongs to a `guest` or the `current` user.
   * After that, the QuickBuy buttons are displayed.
   *
   * If the cart belongs to an `anonymous` user, the `createCartGuestUser` function
   * is called to create and associate a new guest user.
   */
  isUserGuestOrLoggedIn(): Observable<boolean> {
    return combineLatest([
      this.activeCartFacade.isGuestCart(),
      this.authService.isUserLoggedIn(),
    ]).pipe(
      take(1),
      mergeMap(([isGuestUser, isLoggedInUser]) => {
        if (isGuestUser || isLoggedInUser) {
          return of(true);
        } else {
          return combineLatest([
            this.userIdService.getUserId(),
            this.activeCartFacade.takeActiveCartId(),
          ]).pipe(
            take(1),
            switchMap(([userId, cartId]) =>
              this.cartGuestUserFacade.createCartGuestUser(userId, cartId).pipe(
                tap(() => this.multiCartFacade.reloadCart(cartId)),
                map(() => true)
              )
            )
          );
        }
      })
    );
  }
}
