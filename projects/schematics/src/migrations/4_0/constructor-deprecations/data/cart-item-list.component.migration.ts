/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ACTIVE_CART_SERVICE,
  CART_ITEM_LIST_COMPONENT,
  FEATURE_CONFIG_SERVICE,
  MULTI_CART_SERVICE,
  SELECTIVE_CART_SERVICE,
  USER_ID_SERVICE,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CART_ITEM_LIST_COMPONENT_MIGRATIONS: ConstructorDeprecation[] = [
  // projects/storefrontlib/cms-components/cart/cart-shared/cart-item-list/cart-item-list.component.ts
  {
    class: CART_ITEM_LIST_COMPONENT,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedParams: [
      { className: ACTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
      { className: SELECTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
    ],
    addParams: [
      { className: USER_ID_SERVICE, importPath: SPARTACUS_CORE },
      { className: MULTI_CART_SERVICE, importPath: SPARTACUS_CORE },
    ],
  },
  {
    class: CART_ITEM_LIST_COMPONENT,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedParams: [
      { className: ACTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
      { className: SELECTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
    ],
    removeParams: [
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
    ],
    addParams: [
      { className: USER_ID_SERVICE, importPath: SPARTACUS_CORE },
      { className: MULTI_CART_SERVICE, importPath: SPARTACUS_CORE },
    ],
  },
  {
    class: CART_ITEM_LIST_COMPONENT,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedParams: [
      { className: ACTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
      { className: SELECTIVE_CART_SERVICE, importPath: SPARTACUS_CORE },
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
      { className: USER_ID_SERVICE, importPath: SPARTACUS_CORE },
      { className: MULTI_CART_SERVICE, importPath: SPARTACUS_CORE },
    ],
    removeParams: [
      { className: FEATURE_CONFIG_SERVICE, importPath: SPARTACUS_CORE },
    ],
  },
];
