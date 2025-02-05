/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

/**
 * Removes the `tsconfig.server.json` file from the project,
 * to align with the new Angular v17 standards.
 */
export function removeTsConfigServer(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigServerPath = 'tsconfig.server.json';

    context.logger.info(`\n⏳ Removing ${tsconfigServerPath}...`);

    if (!tree.exists(tsconfigServerPath)) {
      printErrorWithAdviceToFollowDocs(
        `${tsconfigServerPath} file not found`,
        context
      );
      return;
    }

    tree.delete(tsconfigServerPath);

    context.logger.info(`✅ Removed ${tsconfigServerPath}`);
  };
}
