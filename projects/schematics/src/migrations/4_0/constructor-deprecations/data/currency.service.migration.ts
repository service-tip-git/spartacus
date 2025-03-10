/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CURRENCY_SERVICE,
  NGRX_STORE,
  SITE_CONTEXT_CONFIG,
  STORE,
  WINDOW_REF,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CURRENCY_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/core/src/site-context/facade/currency.service.ts
  class: CURRENCY_SERVICE,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [
    { className: STORE, importPath: NGRX_STORE },
    { className: WINDOW_REF, importPath: SPARTACUS_CORE },
    { className: SITE_CONTEXT_CONFIG, importPath: SPARTACUS_CORE },
  ],
  removeParams: [{ className: WINDOW_REF, importPath: SPARTACUS_CORE }],
};
