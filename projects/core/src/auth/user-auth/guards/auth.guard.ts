/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { GuardResult, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SemanticPathService } from '../../../routing/configurable-routes/url-translation/semantic-path.service';
import { AuthService } from '../facade/auth.service';
import { AuthRedirectService } from '../services/auth-redirect.service';

/**
 * Checks if there is currently logged in user.
 * Use to protect pages dedicated only for logged in users.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    protected authService: AuthService,
    protected authRedirectService: AuthRedirectService,
    protected router: Router,
    protected semanticPathService: SemanticPathService
  ) {}

  canActivate(): Observable<GuardResult> {
    return this.authService.isUserLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.authRedirectService.saveCurrentNavigationUrl();
          return this.router.parseUrl(
            this.semanticPathService.get('login') ?? ''
          );
        }
        return isLoggedIn;
      })
    );
  }
}
