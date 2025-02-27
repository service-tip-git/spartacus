/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ANGULAR_CORE,
  COMPILER,
  CONFIG_INITIALIZER_SERVICE,
  FEATURE_MODULES_SERVICE,
  INJECTOR,
  LAZY_MODULES_SERVICE,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const FEATURE_MODULES_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/storefrontlib/cms-structure/services/feature-modules.service.ts
  class: FEATURE_MODULES_SERVICE,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [
    {
      className: CONFIG_INITIALIZER_SERVICE,
      importPath: SPARTACUS_CORE,
    },
    {
      className: COMPILER,
      importPath: ANGULAR_CORE,
    },
    {
      className: INJECTOR,
      importPath: ANGULAR_CORE,
    },
  ],
  removeParams: [
    {
      className: COMPILER,
      importPath: ANGULAR_CORE,
    },
    {
      className: INJECTOR,
      importPath: ANGULAR_CORE,
    },
  ],
  addParams: [
    {
      className: LAZY_MODULES_SERVICE,
      importPath: SPARTACUS_CORE,
    },
  ],
};
