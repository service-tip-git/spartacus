/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { AuthService, useFeatureStyles } from '@spartacus/core';
import { User, UserAccountFacade } from '@spartacus/user/account/root';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgIf, AsyncPipe } from '@angular/common';
import { PageSlotComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-login',
  templateUrl: './login.component.html',
  imports: [
    NgIf,
    PageSlotComponent,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class LoginComponent implements OnInit {
  user$: Observable<User | undefined>;

  constructor(
    private auth: AuthService,
    private userAccount: UserAccountFacade
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
}
