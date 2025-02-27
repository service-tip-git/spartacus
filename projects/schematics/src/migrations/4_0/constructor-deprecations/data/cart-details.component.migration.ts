/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ACTIVE_CART_SERVICE,
  AUTH_SERVICE,
  CART_DETAILS_COMPONENT,
  PROMOTION_SERVICE,
  ROUTING_SERVICE,
  SELECTIVE_CART_SERVICE,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CART_DETAILS_COMPONENT_MIGRATION: ConstructorDeprecation = {
  // projects/storefrontlib/cms-components/cart/cart-details/cart-details.component.ts
  class: CART_DETAILS_COMPONENT,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [
    { className: ACTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
    { className: PROMOTION_SERVICE, importPath: SPARTACUS_STOREFRONTLIB },
    { className: SELECTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
    { className: AUTH_SERVICE, importPath: SPARTACUS_CORE },
    { className: ROUTING_SERVICE, importPath: SPARTACUS_CORE },
  ],
  removeParams: [
    { className: PROMOTION_SERVICE, importPath: SPARTACUS_STOREFRONTLIB },
  ],
};
