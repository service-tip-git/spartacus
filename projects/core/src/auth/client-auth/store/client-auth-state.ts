/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { LoaderState } from '../../../state/utils/loader/loader-state';
import { ClientToken } from '../models/client-token.model';

export const CLIENT_AUTH_FEATURE = 'client-auth';
export const CLIENT_TOKEN_DATA = '[Client auth] Client Token Data';

export interface StateWithClientAuth {
  [CLIENT_AUTH_FEATURE]: ClientAuthState;
}

export interface ClientAuthState {
  clientToken: LoaderState<ClientToken>;
}
