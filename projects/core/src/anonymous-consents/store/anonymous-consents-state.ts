/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnonymousConsent, ConsentTemplate } from '../../model/consent.model';
import { StateUtils } from '../../state';

export const ANONYMOUS_CONSENTS_STORE_FEATURE = 'anonymous-consents';
export const ANONYMOUS_CONSENTS = '[Anonymous Consents] Anonymous Consents';

export interface StateWithAnonymousConsents {
  [ANONYMOUS_CONSENTS_STORE_FEATURE]: AnonymousConsentsState;
}

export interface AnonymousConsentsState {
  templates: StateUtils.LoaderState<ConsentTemplate[]>;
  consents: AnonymousConsent[];
  ui: {
    bannerDismissed: boolean;
    updated: boolean;
  };
}
