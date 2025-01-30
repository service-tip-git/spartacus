import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Updates `main.server.ts` file for new Angular v17 standards.
 *
 * Modifies the `AppServerModule` import to use the new file path
 * and exports it as the default export.
 */
export function updateMainServerTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating main.server.ts...');

    const mainServerPath = 'src/main.server.ts';
    if (!tree.exists(mainServerPath)) {
      context.logger.warn('⚠️ No main.server.ts found');
      return;
    }

    const mainServerContent = tree.read(mainServerPath);
    if (mainServerContent) {
      const updatedContent = mainServerContent
        .toString()
        .replace(
          /export \{ AppServerModule \} from '\.\/app\/app\.server\.module';/,
          "export { AppServerModule as default } from './app/app.module.server';"
        );
      tree.overwrite(mainServerPath, updatedContent);
    }

    context.logger.info('✅ Updated main.server.ts');
  };
}
