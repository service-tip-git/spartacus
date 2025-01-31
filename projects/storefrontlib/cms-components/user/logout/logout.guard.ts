/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  AuthService,
  CmsService,
  PageType,
  ProtectedRoutesService,
  SemanticPathService,
} from '@spartacus/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Guards the _logout_ route.
 *
 * Takes care of routing the user to a logout page (if available) or redirects to
 * the homepage. If the homepage is protected, the user is redirected
 * to the login route instead.
 */
@Injectable({
  providedIn: 'root',
})
export class LogoutGuard {
  constructor(
    protected auth: AuthService,
    protected cms: CmsService,
    protected semanticPathService: SemanticPathService,
    protected protectedRoutes: ProtectedRoutesService,
    protected router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    /**
     * First we want to complete logout process before redirecting to logout page
     * We want to avoid errors like `token is no longer valid`
     */
    return from(this.logout()).pipe(
      switchMap(() => {
        return this.cms
          .hasPage({
            id: this.semanticPathService.get('logout') ?? '',
            type: PageType.CONTENT_PAGE,
          })
          .pipe(
            map((hasPage) => {
              if (!hasPage) {
                return this.getRedirectUrl();
              }
              // TODO(#9385): Use CMS page guard here.
              return hasPage;
            })
          );
      })
    );
  }

  protected logout(): Promise<any> {
    return this.auth.coreLogout();
  }

  /**
   * Whenever there is no specific "logout" page configured in the CMS,
   * we redirect after the user is logged out.
   *
   * The user gets redirected to the homepage, unless the homepage is protected
   * (in case of a closed shop). We'll redirect to the login page instead.
   */
  protected getRedirectUrl(): UrlTree {
    const cxRoute = this.protectedRoutes.shouldProtect ? 'login' : 'home';
    return this.router.parseUrl(this.semanticPathService.get(cxRoute) ?? '');
  }
}
