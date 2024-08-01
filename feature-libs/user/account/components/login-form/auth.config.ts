/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthConfig } from 'angular-oauth2-oidc';

export function createAuthConfig(issuer: string,clientId: string, baseSite: string, scope: string): AuthConfig {
  return {
    issuer: issuer,
    redirectUri: window.location.origin + '/' + baseSite +'/en/USD/login',
    clientId: clientId,
    responseType: 'code',
    scope: scope,
    showDebugInformation: true,
    timeoutFactor: 0.01,
    checkOrigin: false,
  };
}
