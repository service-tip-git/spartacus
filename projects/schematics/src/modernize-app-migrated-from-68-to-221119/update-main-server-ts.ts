import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Updates `main.server.ts` file for new Angular v17 standards.
 *
 * Modifies the `AppServerModule` import to use the new file path
 * and exports it as the default export.
 */
export function updateMainServerTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const mainServerPath = 'src/main.server.ts';
    context.logger.info(`⏳ Updating ${mainServerPath}...`);

    if (!tree.exists(mainServerPath)) {
      throw new Error(`${mainServerPath} file not found`);
    }

    const mainServerContent = tree.read(mainServerPath);
    if (!mainServerContent) {
      throw new Error(`Failed to read ${mainServerPath} file`);
    }

    const updatedContent = mainServerContent
      .toString()
      .replace(
        /export \{ AppServerModule \} from '\.\/app\/app\.server\.module';/,
        "export { AppServerModule as default } from './app/app.module.server';"
      );
    tree.overwrite(mainServerPath, updatedContent);

    context.logger.info(`✅ Updated ${mainServerPath}`);
  };
}
