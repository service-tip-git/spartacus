import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Removes the `tsconfig.server.json` file from the project,
 * to align with the new Angular v17 standards.
 */
export function removeTsConfigServer(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigServerPath = 'tsconfig.server.json';

    context.logger.info(`⏳ Removing ${tsconfigServerPath}...`);

    if (tree.exists(tsconfigServerPath)) {
      tree.delete(tsconfigServerPath);
    } else {
      throw new Error(
        `${tsconfigServerPath} could not be removed, because it does not exist`
      );
    }

    context.logger.info(`✅ Removed ${tsconfigServerPath}`);
  };
}
