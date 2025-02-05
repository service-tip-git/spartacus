/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';
import { parse } from 'jsonc-parser';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

/**
 * Updates `package.json` scripts related to SSR to align with new Angular v17 standards.
 *
 * 1. Removes properties `"dev:ssr"` and `"prerender"`
 * 2. Changes value of the property `"build:ssr"` to `"ng build"`
 * 3. Renames the property `"serve:ssr"` to `"serve:ssr:YOUR-APP-NAME"` and change its value to `"node dist/YOUR-APP-NAME/server/server.mjs"`
 * ```
 */
export function updatePackageJsonServerScripts(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';

    context.logger.info(`\n⏳ Updating ${packageJsonPath} scripts...`);

    if (!tree.exists(packageJsonPath)) {
      printErrorWithAdviceToFollowDocs(
        `${packageJsonPath} file not found`,
        context
      );
      return;
    }

    // Get app name from workspace
    const { workspace } = getWorkspace(tree);
    const projectName = Object.keys(workspace.projects)[0];
    if (!projectName) {
      printErrorWithAdviceToFollowDocs(
        'No project found in workspace',
        context
      );
      return;
    }

    const content = tree.read(packageJsonPath);
    if (!content) {
      printErrorWithAdviceToFollowDocs(
        `Failed to read ${packageJsonPath} file`,
        context
      );
      return;
    }

    const packageJson = parse(content.toString());

    if (!packageJson.scripts) {
      printErrorWithAdviceToFollowDocs(
        `No scripts section found in ${packageJsonPath}`,
        context
      );
      return;
    }

    context.logger.info('  ↳ Removing "dev:ssr" script');
    delete packageJson.scripts['dev:ssr'];

    context.logger.info('  ↳ Removing "prerender" script');
    delete packageJson.scripts['prerender'];

    context.logger.info('  ↳ Removing "serve:ssr" script');
    delete packageJson.scripts['serve:ssr'];

    context.logger.info('  ↳ Updating "build:ssr" script');
    packageJson.scripts['build:ssr'] = 'ng build';

    context.logger.info(`  ↳ Adding "serve:ssr:${projectName}" script`);
    packageJson.scripts[`serve:ssr:${projectName}`] =
      `node dist/${projectName}/server/server.mjs`;

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    context.logger.info(`✅ Updated ${packageJsonPath} scripts`);
  };
}
