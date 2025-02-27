/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CONFIG_INITIALIZER_SERVICE,
  GET_STABLE,
  GET_STABLE_CONFIG,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

//projects/core/src/config/config-initializer/config-initializer.service.ts
export const CONFIG_INITIALIZER_SERVICE_MIGRATION: MethodPropertyDeprecation[] =
  [
    {
      class: CONFIG_INITIALIZER_SERVICE,
      importPath: SPARTACUS_CORE,
      deprecatedNode: GET_STABLE_CONFIG,
      comment: `// ${TODO_SPARTACUS} Method '${CONFIG_INITIALIZER_SERVICE}.${GET_STABLE_CONFIG}' was removed from '${CONFIG_INITIALIZER_SERVICE}'. Instead use method '${GET_STABLE}'`,
    },
  ];
