import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { removeImportsFromServerTs } from './update-server-ts/remove-imports-from-server-ts';
import { addImportsToServerTs } from './update-server-ts/add-imports-to-server-ts';
import { removeWebpackFromServerTs } from './update-server-ts/remove-webpack-from-server-ts';
import { updateVariablesInServerTs } from './update-server-ts/update-variables-in-server-ts';
import { removeReexportFromServerTs } from './update-server-ts/remove-reexport-from-server-ts';

/**
 * Updates `server.ts` file for new Angular v17 standards.
 *
 * Modernizes imports, configures new paths for `index.html` file,
 * removes Webpack-specific code, and removes obsolete export.
 */
export function updateServerTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const serverTsPath = 'server.ts';

    context.logger.info(`⏳ Updating ${serverTsPath} implementation...`);

    if (!tree.exists(serverTsPath)) {
      context.logger.warn(`⚠️ ${serverTsPath} file not found`);
      return;
    }

    const content = tree.read(serverTsPath);
    if (!content) {
      throw new Error(`Failed to read ${serverTsPath} file`);
    }

    let updatedContent = content.toString();
    updatedContent = removeImportsFromServerTs(updatedContent);
    updatedContent = addImportsToServerTs(updatedContent);
    updatedContent = updateVariablesInServerTs(updatedContent);
    updatedContent = removeWebpackFromServerTs(updatedContent);
    updatedContent = removeReexportFromServerTs(updatedContent);

    tree.overwrite(serverTsPath, updatedContent);

    context.logger.info(`✅ Updated ${serverTsPath} implementation`);
  };
}
