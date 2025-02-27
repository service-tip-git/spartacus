/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ANGULAR_CORE,
  ANY_TYPE,
  BREAKPOINT_SERVICE,
  LAYOUT_CONFIG,
  PLATFORM,
  PLATFORM_ID_STRING,
  WINDOW_REF,
} from '../../../../shared/constants';
import {
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const BREAKPOINT_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/storefrontlib/layout/breakpoint/breakpoint.service.ts
  class: BREAKPOINT_SERVICE,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [
    {
      className: WINDOW_REF,
      importPath: SPARTACUS_CORE,
    },
    {
      className: LAYOUT_CONFIG,
      importPath: SPARTACUS_STOREFRONTLIB,
    },
  ],
  addParams: [
    {
      className: PLATFORM,
      literalInference: ANY_TYPE,
      injectionToken: {
        token: PLATFORM_ID_STRING,
        importPath: ANGULAR_CORE,
      },
    },
  ],
};
