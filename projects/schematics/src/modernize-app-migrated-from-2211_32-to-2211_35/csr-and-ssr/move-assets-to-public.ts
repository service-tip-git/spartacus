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
    const oldDir = 'src/assets';
    const newDir = 'public';
    context.logger.info(
      `\n⏳ Moving assets folder from "${oldDir}/" to "${newDir}/"...`
    );

    const sourceDir = tree.getDir(oldDir);
    if (!sourceDir.subfiles.length && !sourceDir.subdirs.length) {
      printErrorWithDocs(
        `Assets folder not found or empty at ${oldDir}`,
        context
      );
      return;
    }

    try {
      tree.getDir(oldDir).visit((filePath) => {
        const relativeFilePath = filePath.replace(`${oldDir}/`, '');
        context.logger.info(`  ↳ Moving file "${filePath}"`);

        const content = tree.read(filePath);
        if (content) {
          tree.create(`${newDir}/${relativeFilePath}`, content);
        } else {
          printErrorWithDocs(`Failed to read ${filePath} file`, context);
          return;
        }
      });
    } catch (error) {
      printErrorWithDocs(
        `Error moving assets file from "${oldDir}" to "${newDir}". Error: ${error}`,
        context
      );
    }

    context.logger.info(`  ↳ Deleting old "${oldDir}/" directory`);
    try {
      tree.delete(oldDir);
    } catch (error) {
      printErrorWithDocs(
        `Error deleting old assets directory "${oldDir}". Error: ${error}`,
        context
      );
    }

    context.logger.info(
      `✅ Moved assets folder from "${oldDir}/" to "${newDir}/"`
    );
  };
}
