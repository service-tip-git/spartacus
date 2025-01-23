/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { AuthService, RoutingService, useFeatureStyles } from '@spartacus/core';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-add-to-saved-cart',
  templateUrl: './add-to-saved-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AddToSavedCartComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();
  protected loggedIn = false;

  @ViewChild('element') element: ElementRef;

  cart$: Observable<Cart>;

  /**
   * Whether to show the "Save cart for later" button. Contingent on whether there are actual entries to save.
   */
  disableSaveCartForLater$: Observable<boolean>;

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected authService: AuthService,
    protected routingService: RoutingService,
    protected vcr: ViewContainerRef,
    protected launchDialogService: LaunchDialogService
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
    useFeatureStyles('a11yUseButtonsForBtnLinks');
  }

  ngOnInit(): void {
    this.cart$ = combineLatest([
      this.activeCartFacade.getActive(),
      this.authService.isUserLoggedIn(),
    ]).pipe(
      tap(([_, loggedIn]) => (this.loggedIn = loggedIn)),
      map(([activeCart]) => activeCart)
    );

    this.disableSaveCartForLater$ = this.cart$.pipe(
      map((cart) => !cart.entries?.length)
    );
  }

  saveCart(cart: Cart): void {
    this.subscription.add(
      this.disableSaveCartForLater$.subscribe((isDisabled) => {
        if (isDisabled) {
          return;
        }

        if (this.loggedIn) {
          this.openDialog(cart);
        } else {
          this.routingService.go({ cxRoute: 'login' });
        }
      })
    );
  }

  openDialog(cart: Cart) {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.SAVED_CART,
      this.element,
      this.vcr,
      { cart, layoutOption: 'save' }
    );

    if (dialog) {
      this.subscription.add(dialog.pipe(take(1)).subscribe());
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
