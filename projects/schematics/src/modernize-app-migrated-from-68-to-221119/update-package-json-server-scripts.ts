import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../shared/utils/workspace-utils';
import { parse } from 'jsonc-parser';

/**
 * Updates `package.json` scripts related to SSR to align with new Angular v17 standards.
 *
 * Removes deprecated SSR scripts and updates existing ones to use
 * the new file paths and commands for Angular v17 SSR.
 */
export function updatePackageJsonServerScripts(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating package.json scripts...');

    if (!tree.exists('package.json')) {
      throw new Error('package.json file not found');
    }

    // Get app name from workspace
    const { workspace } = getWorkspace(tree);
    const projectName = Object.keys(workspace.projects)[0];
    if (!projectName) {
      throw new Error('No project found in workspace');
    }

    const content = tree.read('package.json');
    if (!content) {
      throw new Error('Failed to read package.json file');
    }

    const packageJson = parse(content.toString());

    if (!packageJson.scripts) {
      throw new Error('No scripts section found in package.json');
    }

    // Remove scripts
    delete packageJson.scripts['dev:ssr'];
    delete packageJson.scripts['prerender'];

    // Update scripts
    if (packageJson.scripts['build:ssr']) {
      packageJson.scripts['build:ssr'] = 'ng build';
    }
    if (packageJson.scripts['serve:ssr']) {
      packageJson.scripts[
        `serve:ssr:${projectName}`
      ] = `node dist/${projectName}/server/server.mjs`;
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    context.logger.info('✅ Updated package.json scripts');
  };
}
