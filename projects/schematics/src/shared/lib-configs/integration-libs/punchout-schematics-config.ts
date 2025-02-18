/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PUNCHOUT_FEATURE_NAME,
  SPARTACUS_PUNCHOUT,
} from '../../libs-constants';
import { SchematicConfig } from '../../utils/lib-utils';

export const PUNCHOUT_FOLDER_NAME = 'punchout';
export const PUNCHOUT_MODULE_NAME = 'Punchout';
export const PUNCHOUT_MODULE = 'PunchoutModule';

export const PUNCHOUT_SCHEMATICS_CONFIG: SchematicConfig = {
  library: {
    featureName: PUNCHOUT_FEATURE_NAME,
    mainScope: SPARTACUS_PUNCHOUT,
    b2b: true,
  },
  folderName: PUNCHOUT_FOLDER_NAME,
  moduleName: PUNCHOUT_MODULE_NAME,
  featureModule: {
    name: PUNCHOUT_MODULE,
    importPath: SPARTACUS_PUNCHOUT,
  },
};
