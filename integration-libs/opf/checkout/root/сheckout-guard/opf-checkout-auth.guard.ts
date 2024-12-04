import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { isEmail } from '@spartacus/cart/base/core';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OpfCheckoutAuthGuard extends CheckoutAuthGuard {
  canActivate(): Observable<boolean | UrlTree> {
    console.log('opf checkout guard');

    return combineLatest([
      this.authService.isUserLoggedIn(),
      this.activeCartFacade.isGuestCart(),
      this.activeCartFacade.isStable(),
      this.activeCartFacade.getActive(),
    ]).pipe(
      map(([isLoggedIn, isGuestCart, isStable, activeCart]) => ({
        isLoggedIn,
        isGuestCart,
        isStable,
        cartUserUid: activeCart?.user?.uid,
      })),
      filter((data) => data.isStable),
      map((data) => {
        const isEmailExistsInCart = isEmail(
          data.cartUserUid?.split('|').slice(1).join('|')
        );

        this.router.events.subscribe((event) => console.log(event));

        if (!data.isLoggedIn && data.isGuestCart && !isEmailExistsInCart) {
          console.log('here');
          return this.handleGuestUserWithoutEmail();
        }

        if (!data.isLoggedIn) {
          return data.isGuestCart && isEmailExistsInCart
            ? true
            : this.handleAnonymousUser();
        }
        return data.isLoggedIn;
      })
    );
  }

  protected handleGuestUserWithoutEmail(): boolean | UrlTree {
    // this.authRedirectService.saveCurrentNavigationUrl();
    if (this.checkoutConfigService.isGuestCheckout()) {
      console.log(
        'here 2',
        this.semanticPathService.get('checkoutLogin'),
        this.router.createUrlTree([
          this.semanticPathService.get('checkoutLogin'),
        ])
      );
      return this.router.createUrlTree([
        this.semanticPathService.get('checkoutLogin'),
      ]);
    } else {
      return this.router.parseUrl(
        this.semanticPathService.get('checkoutLogin') ?? ''
      );
    }
  }
}
