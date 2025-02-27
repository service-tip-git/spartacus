/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ANGULAR_CORE,
  BREAKPOINT_SERVICE,
  ELEMENT_REF,
  SPLIT_VIEW_COMPONENT,
  SPLIT_VIEW_SERVICE,
} from '../../../../shared/constants';
import { SPARTACUS_STOREFRONTLIB } from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const SPLIT_VIEW_COMPONENT_MIGRATION: ConstructorDeprecation = {
  // projects/storefrontlib/shared/components/split-view/split/split-view.component.ts
  class: SPLIT_VIEW_COMPONENT,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [
    {
      className: SPLIT_VIEW_SERVICE,
      importPath: SPARTACUS_STOREFRONTLIB,
    },
  ],
  addParams: [
    {
      className: BREAKPOINT_SERVICE,
      importPath: SPARTACUS_STOREFRONTLIB,
    },
    {
      className: ELEMENT_REF,
      importPath: ANGULAR_CORE,
    },
  ],
};
