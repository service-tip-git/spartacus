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
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { PageSlotComponent } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    NgIf,
    PageSlotComponent,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    TranslatePipe,
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
