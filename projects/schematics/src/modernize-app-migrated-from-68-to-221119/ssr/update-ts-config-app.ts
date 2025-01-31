/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

/**
 * Updates `tsconfig.app.json` to align with new Angular v17 standards.
 *
 * Adds NodeJS types and server files to `tsconfig.app.json`.
 */
export function updateTsConfigApp(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigAppPath = 'tsconfig.app.json';

    context.logger.info(`⏳ Updating ${tsconfigAppPath} configuration...`);

    // Update tsconfig.app.json
    if (!tree.exists(tsconfigAppPath)) {
      throw new Error('tsconfig.app.json file not found');
    }

    const tsConfigAppContent = tree.read(tsconfigAppPath);
    if (!tsConfigAppContent) {
      throw new Error('Failed to read tsconfig.app.json file');
    }

    const tsConfigApp = parse(tsConfigAppContent.toString());

    // Update `compilerOptions.types`
    tsConfigApp.compilerOptions = {
      ...tsConfigApp.compilerOptions,
      types: [...(tsConfigApp.compilerOptions?.types || []), 'node'],
    };

    // Update `files`
    const serverFiles = ['src/main.server.ts', 'server.ts'];
    tsConfigApp.files = Array.from(
      new Set([...(tsConfigApp.files || []), ...serverFiles])
    );

    tree.overwrite(tsconfigAppPath, JSON.stringify(tsConfigApp, null, 2));

    context.logger.info(`✅ Updated ${tsconfigAppPath} configuration`);
  };
}
