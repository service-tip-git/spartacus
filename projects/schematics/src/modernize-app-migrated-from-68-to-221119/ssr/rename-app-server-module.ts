import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Renames `app.server.module.ts` to `app.module.server.ts`
 * to align with new Angular v17 standards.
 */
export function renameAppServerModule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    enum AppServerModulePaths {
      old = 'src/app/app.server.module.ts',
      new = 'src/app/app.module.server.ts',
    }
    context.logger.info(
      `⏳ Renaming ${AppServerModulePaths.old} to ${AppServerModulePaths.new}...`
    );

    if (!tree.exists(AppServerModulePaths.old)) {
      throw new Error('app.server.module.ts file not found');
    }

    const content = tree.read(AppServerModulePaths.old);
    if (!content) {
      throw new Error('Failed to read app.server.module.ts file');
    }

    tree.create(AppServerModulePaths.new, content.toString());
    tree.delete(AppServerModulePaths.old);

    context.logger.info(
      `✅ Renamed ${AppServerModulePaths.old} to ${AppServerModulePaths.new}`
    );
  };
}
