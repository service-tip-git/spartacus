/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { LEGACY_FLAG, TODO_SPARTACUS } from '../../../../shared/constants';
import { ConfigDeprecation } from '../../../../shared/utils/file-utils';

export const LEGACY_FLAG_MIGRATION: ConfigDeprecation = {
  propertyName: LEGACY_FLAG,
  comment: `// ${TODO_SPARTACUS} '${LEGACY_FLAG}' has been removed. Just remove this property, as legacy systems are supported by optional implementations.\n`,
};
