/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { ConfigInitializer } from 'projects/core/src/config/config-initializer/config-initializer';

import { Observable, lastValueFrom, of } from 'rxjs';
import { BaseSiteService } from '../../../site-context/facade/base-site.service';
import { AuthConfig } from './auth-config';

@Injectable({ providedIn: 'root' })
export class AuthConfigInitializer implements ConfigInitializer {
  protected baseSiteService = inject(BaseSiteService);
  readonly scopes = ['authentication'];
  readonly configFactory = () => lastValueFrom(this.resolveConfig());

  /**
   * Emits the Auth config basing on the current base site data.
   *
   * Completes after emitting the value.
   */
  protected resolveConfig(): Observable<AuthConfig> {
    // // eslint-disable-next-line no-debugger
    // debugger;

    const result: AuthConfig = {
      authentication: {
        client_id: 'testid1',
        revokeEndpoint: '/revoke',
        // client_secret: 'secret',
        OAuthLibConfig: {
          issuer: 'https://localhost:9002/authserver',
          redirectUri: `${window.location.origin}/login`,
          disablePKCE: true,
          responseType: 'code',
        },
      }
    };
    return of(result);
  }
}
