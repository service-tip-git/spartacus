/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { RoutingConfigService } from '@spartacus/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
// It is just an standalone alternative to extending CheckoutAuthGuard
export class CheckoutGuardService {
  private router = inject(Router);
  activeCart = inject(ActiveCartFacade);
  routingConfigService = inject(RoutingConfigService);
  route = inject(ActivatedRoute);

  listenToCheckoutRoute(): void {
    console.log('listenToCheckoutRoute()');

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.onCheckoutEnter();
      });
  }

  protected onCheckoutEnter(): void {
    console.log('Nav curr', this.router.url);

    console.log(this.route);
    console.log(
      this.routingConfigService.getRouteName('checkout/delivery-mode')
    );

    // 1. Check if route is related to checkout
    // 2. Redirect to /checkout-login
  }
}
