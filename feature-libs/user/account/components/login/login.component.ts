/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ElementRef, OnInit } from '@angular/core';
import {
  AuthService,
  TranslationService,
  useFeatureStyles,
} from '@spartacus/core';
import { User, UserAccountFacade } from '@spartacus/user/account/root';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  user$: Observable<User | undefined>;

  constructor(
    private auth: AuthService,
    private userAccount: UserAccountFacade,
    private elemRef: ElementRef,
    private translation: TranslationService
  ) {
    useFeatureStyles('a11yMyAccountLinkOutline');
  }

  ngOnInit(): void {
    this.user$ = this.auth.isUserLoggedIn().pipe(
      switchMap((isUserLoggedIn) => {
        if (isUserLoggedIn) {
          return this.userAccount.get();
        } else {
          return of(undefined);
        }
      })
    );
  }

  get greeting$() {
    return this.user$.pipe(
      switchMap((user) =>
        this.translation.translate(`miniLogin.userGreeting`, {
          name: user?.name,
        })
      ),
      tap((greeting) => {
        const rootNavButton = this.elemRef.nativeElement.querySelector(
          'cx-navigation-ui nav ul li:first-child button'
        );
        if (rootNavButton) {
          rootNavButton.setAttribute('aria-label', greeting);
        }
      })
    );
  }
}
