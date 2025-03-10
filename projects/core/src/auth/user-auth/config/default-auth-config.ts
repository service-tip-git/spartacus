/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthConfig } from './auth-config';

export const defaultAuthConfig: AuthConfig = {
  authentication: {
    client_id: 'mobile_android',
    client_secret: 'secret',
    tokenEndpoint: '/oauth/token',
    revokeEndpoint: '/oauth/revoke',
    loginUrl: '/oauth/authorize',
    OAuthLibConfig: {
      scope: '',
      customTokenParameters: ['token_type'],
      strictDiscoveryDocumentValidation: false,
      skipIssuerCheck: true,
      disablePKCE: true,
      oidc: false,
      clearHashAfterLogin: false,
    },
  },
};
