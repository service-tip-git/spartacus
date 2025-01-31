import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Updates `main.server.ts` file for new Angular v17 standards.
 *
 * 1. Changes the the export path of the `AppServerModule` from `./app/app.server.module'` to `./app/app.module.server'`.
 * 2. Exports `AppServerModule` using `as default`.
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

    const expectedPattern =
      /export \{ AppServerModule \} from ['"]\.\/app\/app\.server\.module['"];/;
    const newPattern = `export { AppServerModule as default } from './app/app.module.server';`;

    let updatedContent = mainServerContent.toString();
    if (!expectedPattern.test(updatedContent)) {
      throw new Error(`${mainServerPath} does not contain the expected export`);
    }

    updatedContent = updatedContent.replace(expectedPattern, newPattern);
    tree.overwrite(mainServerPath, updatedContent);

    context.logger.info(`✅ Updated ${mainServerPath}`);
  };
}
