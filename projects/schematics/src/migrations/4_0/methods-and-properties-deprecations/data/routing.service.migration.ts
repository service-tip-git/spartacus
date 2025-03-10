/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GO,
  ROUTING_SERVICE,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

// projects/core/src/routing/facade/routing.service.ts
export const ROUTING_SERVICE_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: ROUTING_SERVICE,
    importPath: SPARTACUS_CORE,
    deprecatedNode: GO,
    comment: `// ${TODO_SPARTACUS} '${ROUTING_SERVICE}.${GO}' changed signature. Before 4.0, the object with query params could be passed in the 2nd argument. Now the 2nd argument is Angular NavigationExtras object (with 'queryParams' property).`,
  },
];
