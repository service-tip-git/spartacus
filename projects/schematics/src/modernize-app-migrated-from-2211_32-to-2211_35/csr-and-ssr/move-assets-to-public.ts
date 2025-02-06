/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 as printErrorWithDocs } from '../fallback-advice-to-follow-docs';

/**
 * Moves the `src/assets/` folder to the root and renames it to `public/`,
 * to adapt to the new Angular v19 standards.
 */
export function moveAssetsToPublic(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const oldPath = 'src/assets';
    const newPath = 'public';
    context.logger.info(
      `\n⏳ Moving assets folder from "${oldPath}/" to "${newPath}/"...`
    );

    const sourceDir = tree.getDir(oldPath);
    if (!sourceDir.subfiles.length && !sourceDir.subdirs.length) {
      printErrorWithDocs(
        `Assets folder not found or empty at ${oldPath}`,
        context
      );
      return;
    }

    try {
      tree.getDir(oldPath).visit((filePath) => {
        context.logger.info(`  ↳ Moving file "${filePath}" to "${newPath}/"`);

        const content = tree.read(`${oldPath}/${filePath}`);
        if (content) {
          tree.create(`${newPath}/${filePath}`, content);
        }
      });
    } catch (error) {
      printErrorWithDocs(
        `Error moving assets file from "${oldPath}" to "${newPath}". Error: ${error}`,
        context
      );
    }

    context.logger.info(`  ↳ Deleting old "${oldPath}/" directory`);
    try {
      tree.delete(oldPath);
    } catch (error) {
      printErrorWithDocs(
        `Error deleting old assets directory "${oldPath}". Error: ${error}`,
        context
      );
    }

    context.logger.info(
      `✅ Moved assets folder from "${oldPath}/" to "${newPath}/"`
    );
  };
}
