/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Renames `app.server.module.ts` to `app.module.server.ts`
 * to align with new Angular v17 standards.
 */
export function renameAppServerModule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const appServerModulePaths = {
      old: 'src/app/app.server.module.ts',
      new: 'src/app/app.module.server.ts',
    };
    context.logger.info(
      `⏳ Renaming ${appServerModulePaths.old} to ${appServerModulePaths.new}...`
    );

    if (!tree.exists(appServerModulePaths.old)) {
      throw new Error('app.server.module.ts file not found');
    }

    const content = tree.read(appServerModulePaths.old);
    if (!content) {
      throw new Error('Failed to read app.server.module.ts file');
    }

    tree.create(appServerModulePaths.new, content.toString());
    tree.delete(appServerModulePaths.old);

    context.logger.info(
      `✅ Renamed ${appServerModulePaths.old} to ${appServerModulePaths.new}`
    );
  };
}
