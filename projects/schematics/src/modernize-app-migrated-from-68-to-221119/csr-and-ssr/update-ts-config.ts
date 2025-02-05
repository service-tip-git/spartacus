/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

/**
 * Updates the `tsconfig.json` file for new Angular v17 standards.
 *
 * 1. Removes the properties `"baseUrl"`, `"forceConsistentCasingInFileNames"`, `"downlevelIteration"`,
 * 2. Adds `"skipLibCheck": true`, `"esModuleInterop": true`
 */
export function updateTsConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigPath = 'tsconfig.json';
    context.logger.info(`\n⏳ Updating ${tsconfigPath}...`);

    if (!tree.exists(tsconfigPath)) {
      printErrorWithAdviceToFollowDocs(
        `${tsconfigPath} file not found`,
        context
      );
      return;
    }

    const tsConfigContent = tree.read(tsconfigPath);
    if (!tsConfigContent) {
      printErrorWithAdviceToFollowDocs(
        `Failed to read ${tsconfigPath} file`,
        context
      );
      return;
    }

    const tsConfig = parse(tsConfigContent.toString());

    if (!tsConfig.compilerOptions) {
      printErrorWithAdviceToFollowDocs(
        `No compilerOptions found in ${tsconfigPath}`,
        context
      );
      return;
    }

    // Remove options
    delete tsConfig.compilerOptions.baseUrl;
    delete tsConfig.compilerOptions.forceConsistentCasingInFileNames;
    delete tsConfig.compilerOptions.downlevelIteration;

    tsConfig.compilerOptions.skipLibCheck = true;
    tsConfig.compilerOptions.esModuleInterop = true;

    tree.overwrite(tsconfigPath, JSON.stringify(tsConfig, null, 2));

    context.logger.info(`✅ Updated ${tsconfigPath}`);
  };
}
