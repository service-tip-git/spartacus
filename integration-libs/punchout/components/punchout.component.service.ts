import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MultiCartFacade } from '@spartacus/cart/base/root';
import {
  AuthActions,
  AuthService,
  AuthStorageService,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  UserIdService,
} from '@spartacus/core';
import { PunchoutFacade, PunchoutSession } from '@spartacus/punchout/root';
import { from, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable()
export class PunchoutComponentService {
  protected authService = inject(AuthService);
  protected punchoutFacade = inject(PunchoutFacade);
  protected authStorageService = inject(AuthStorageService);
  protected userIdService = inject(UserIdService);
  protected store = inject(Store);
  protected routingService = inject(RoutingService);
  protected globalMessageService = inject(GlobalMessageService);
  protected multiCartFacade = inject(MultiCartFacade);
  protected sessionId?: string;

  setSessionId(value: string) {
    this.sessionId = value;
  }

  logout(): Observable<boolean> {
    return this.authService.isUserLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        return isLoggedIn
          ? from(this.authService.coreLogout()).pipe(
              map(() => {
                console.log('logging out');
                this.globalMessageService.remove(
                  GlobalMessageType.MSG_TYPE_CONFIRMATION
                );
                return true;
              })
            )
          : of(false);
      })
    );
  }

  getPunchoutSession(sId: string): Observable<PunchoutSession> {
    return this.punchoutFacade.getPunchoutSession(sId);
  }

  loginWithToken(accessToken: string, userId: string) {
    console.log('Punchout loginWithToken');
    // Code mostly based on auth lib we use and the way it handles token properties
    this.authStorageService.setItem('access_token', accessToken);
    this.authStorageService.setItem('access_token_stored_at', '' + Date.now());
    // OCC specific code
    this.userIdService.setUserId(userId);

    this.store.dispatch(new AuthActions.Login());
    this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_CONFIRMATION);
  }

  routeToTargetPage(punchoutSession: PunchoutSession) {
    if (punchoutSession?.punchOutLevel === 'STORE') {
      this.routingService.go('/');
    }
  }

  loadCart(cartId: string, userId2?: string) {
    console.log('punchout loadCart', userId2);
    return this.userIdService.takeUserId().pipe(
      take(1),
      tap((userId) => {
        this.multiCartFacade.loadCart({
          userId,
          cartId,
          extraData: {
            active: true,
          },
        });
      })
    );
  }
  //extract sid
  //logout
  //
}
// onlyOneRestrictionMustApply
