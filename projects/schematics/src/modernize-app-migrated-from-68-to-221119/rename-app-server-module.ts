import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Renames `app.server.module.ts` to `app.module.server.ts`
 * to align with new Angular v17 standards.
 */
export function renameAppServerModule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Renaming server module files...');

    const appServerModulePath_OLD = 'src/app/app.server.module.ts';
    const appModuleServerPath_NEW = 'src/app/app.module.server.ts';

    if (!tree.exists(appServerModulePath_OLD)) {
      throw new Error('app.server.module.ts file not found');
    }

    const content = tree.read(appServerModulePath_OLD);
    if (!content) {
      throw new Error('Failed to read app.server.module.ts file');
    }

    tree.create(appModuleServerPath_NEW, content.toString());
    tree.delete(appServerModulePath_OLD);

    context.logger.info('✅ Renamed server module files');
  };
}
