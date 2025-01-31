import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Removes the `tsconfig.server.json` file from the project,
 * to align with the new Angular v17 standards.
 */
export function removeTsConfigServer(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigServerPath = 'tsconfig.server.json';

    context.logger.info(`⏳ Removing ${tsconfigServerPath}...`);

    if (!tree.exists(tsconfigServerPath)) {
      throw new Error(`${tsconfigServerPath} file not found`);
    }

    tree.delete(tsconfigServerPath);

    context.logger.info(`✅ Removed ${tsconfigServerPath}`);
  };
}
