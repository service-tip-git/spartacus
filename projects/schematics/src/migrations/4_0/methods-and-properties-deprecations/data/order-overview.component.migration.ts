/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GET_ORDER_CURRENT_DATE_CARD_CONTENT,
  ORDER_OVERVIEW_COMPONENT,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_STOREFRONTLIB } from '../../../../shared/libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

// projects/storefrontlib/shared/components/order-overview/order-overview.component.ts
export const ORDER_OVERVIEW_COMPONENT_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: ORDER_OVERVIEW_COMPONENT,
    importPath: SPARTACUS_STOREFRONTLIB,
    deprecatedNode: GET_ORDER_CURRENT_DATE_CARD_CONTENT,
    comment: `// ${TODO_SPARTACUS} Method '${ORDER_OVERVIEW_COMPONENT}.${GET_ORDER_CURRENT_DATE_CARD_CONTENT}' now requires isoDate parameter. It is no longer optional`,
  },
];
