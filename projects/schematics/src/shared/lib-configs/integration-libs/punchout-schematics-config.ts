import {
  PUNCHOUT_FEATURE_NAME,
  SPARTACUS_PUNCHOUT,
  SPARTACUS_PUNCHOUT_ROOT,
} from '../../libs-constants';
import { SchematicConfig } from '../../utils/lib-utils';

export const PUNCHOUT_FOLDER_NAME = 'punchout';
export const PUNCHOUT_MODULE_NAME = 'Punchout';
export const PUNCHOUT_MODULE = 'PunchoutModule';
export const PUNCHOUT_FEATURE_NAME_CONSTANT = 'PUNCHOUT_FEATURE';

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
  rootModule: {
    name: PUNCHOUT_MODULE,
    importPath: SPARTACUS_PUNCHOUT_ROOT,
  },
  lazyLoadingChunk: {
    moduleSpecifier: SPARTACUS_PUNCHOUT_ROOT,
    namedImports: [PUNCHOUT_FEATURE_NAME_CONSTANT],
  },
};
