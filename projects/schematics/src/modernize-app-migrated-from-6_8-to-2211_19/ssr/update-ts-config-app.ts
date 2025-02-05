/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';
import { mergeArraysWithoutDuplicates } from '../../shared/utils/array-utils';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

/**
 * Updates `tsconfig.app.json` to align with new Angular v17 standards.
 *
 * 1. Adds 1 new item to the array in the property `"types"`: `"node"`
 * 2. Adds 2 new items to the in the `"files"` array: `"src/main.server.ts"` , `"server.ts"`
 */
export function updateTsConfigApp(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigAppPath = 'tsconfig.app.json';

    context.logger.info(`\n⏳ Updating ${tsconfigAppPath} configuration...`);

    if (!tree.exists(tsconfigAppPath)) {
      printErrorWithAdviceToFollowDocs(
        `${tsconfigAppPath} file not found`,
        context
      );
      return;
    }

    const tsConfigAppContent = tree.read(tsconfigAppPath);
    if (!tsConfigAppContent) {
      printErrorWithAdviceToFollowDocs(
        `Failed to read ${tsconfigAppPath} file`,
        context
      );
      return;
    }

    const tsConfigApp = parse(tsConfigAppContent.toString());

    tsConfigApp.compilerOptions = {
      ...tsConfigApp.compilerOptions,
      types: mergeArraysWithoutDuplicates(tsConfigApp.compilerOptions?.types, [
        'node',
      ]),
    };

    const serverFiles = ['src/main.server.ts', 'server.ts'];
    tsConfigApp.files = mergeArraysWithoutDuplicates(
      tsConfigApp.files,
      serverFiles
    );

    tree.overwrite(tsconfigAppPath, JSON.stringify(tsConfigApp, null, 2));

    context.logger.info(`✅ Updated ${tsconfigAppPath} configuration`);
  };
}
