/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BASE_SITES_FOR_CONFIG,
  OCC_ENDPOINT,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

// projects/core/src/occ/occ-models/occ-endpoints.model.ts
export const OCC_ENDPOINTS_MODEL_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: OCC_ENDPOINT,
    importPath: SPARTACUS_CORE,
    deprecatedNode: BASE_SITES_FOR_CONFIG,
    comment: `// ${TODO_SPARTACUS} Property '${OCC_ENDPOINT}.${BASE_SITES_FOR_CONFIG}' was removed. Please use 'baseSites' property instead.`,
  },
];
