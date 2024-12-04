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
export class CheckoutGuardService {
  private router = inject(Router);
  // private route = inject(ActivatedRoute);
  activeCart = inject(ActiveCartFacade);
  routingConfigService = inject(RoutingConfigService);
  route = inject(ActivatedRoute);

  listenToCheckoutRoute(): void {
    console.log('listenToCheckoutRoute()');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('Nav curr', this.router.url);

        console.log(this.route);
        console.log(
          this.routingConfigService.getRouteName('checkout/delivery-mode')
        );
        // this.onCheckoutEnter();
      });
  }

  protected onCheckoutEnter(): void {
    // console.log('Entered the /checkout route!');
  }
}
