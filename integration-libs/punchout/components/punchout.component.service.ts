import { inject, Injectable } from '@angular/core';
import { AuthService } from '@spartacus/core';
import { PunchoutFacade, PunchoutSession } from '@spartacus/punchout/root';
import { from, map, Observable, of, switchMap, take } from 'rxjs';

@Injectable()
export class PunchoutComponentService {
  protected authService = inject(AuthService);
  protected punchoutFacade = inject(PunchoutFacade);
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
  //extract sid
  //logout
  //
}
// onlyOneRestrictionMustApply
