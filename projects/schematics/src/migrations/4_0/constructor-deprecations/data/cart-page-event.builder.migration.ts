/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ACTION_SUBJECT,
  CART_PAGE_EVENT_BUILDER,
  EVENT_SERVICE,
  FEATURE_CONFIG_SERVICE,
  RXJS,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V1: ConstructorDeprecation =
  {
    // projects/storefrontlib/events/cart/cart-page-event.builder.ts
    class: CART_PAGE_EVENT_BUILDER,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedParams: [
      { className: ACTION_SUBJECT, importPath: RXJS },
      { className: EVENT_SERVICE, importPath: SPARTACUS_CORE },
    ],
    removeParams: [{ className: ACTION_SUBJECT, importPath: RXJS }],
  };

export const CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V2: ConstructorDeprecation =
  {
    // projects/storefrontlib/events/cart/cart-page-event.builder.ts
    class: CART_PAGE_EVENT_BUILDER,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedParams: [
      { className: ACTION_SUBJECT, importPath: RXJS },
      { className: EVENT_SERVICE, importPath: SPARTACUS_CORE },
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
    ],
    removeParams: [
      { className: ACTION_SUBJECT, importPath: RXJS },
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
    ],
  };
