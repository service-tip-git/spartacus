/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Removes the `tsconfig.server.json` file from the project,
 * to align with the new Angular v17 standards.
 */
export function removeTsConfigServer(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigServerPath = 'tsconfig.server.json';

    context.logger.info(`⏳ Removing ${tsconfigServerPath}...`);
    // Remove tsconfig.server.json
    if (tree.exists(tsconfigServerPath)) {
      tree.delete(tsconfigServerPath);
    }

    context.logger.info(`✅ Removed ${tsconfigServerPath}`);
  };
}
