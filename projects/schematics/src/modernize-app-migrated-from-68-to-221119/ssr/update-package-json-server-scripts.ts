import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';
import { parse } from 'jsonc-parser';

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

    context.logger.info(`⏳ Updating ${packageJsonPath} scripts...`);

    if (!tree.exists(packageJsonPath)) {
      throw new Error(`${packageJsonPath} file not found`);
    }

    // Get app name from workspace
    const { workspace } = getWorkspace(tree);
    const projectName = Object.keys(workspace.projects)[0];
    if (!projectName) {
      throw new Error('No project found in workspace');
    }

    const content = tree.read(packageJsonPath);
    if (!content) {
      throw new Error(`Failed to read ${packageJsonPath} file`);
    }

    const packageJson = parse(content.toString());

    if (!packageJson.scripts) {
      throw new Error(`No scripts section found in ${packageJsonPath}`);
    }

    // Remove scripts
    delete packageJson.scripts['dev:ssr'];
    delete packageJson.scripts['prerender'];
    delete packageJson.scripts['serve:ssr'];

    // Update scripts
    packageJson.scripts['build:ssr'] = 'ng build';
    packageJson.scripts[
      `serve:ssr:${projectName}`
    ] = `node dist/${projectName}/server/server.mjs`;

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    context.logger.info(`✅ Updated ${packageJsonPath} scripts`);
  };
}
