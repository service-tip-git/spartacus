import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

/**
 * Updates `tsconfig.app.json` to align with new Angular v17 standards.
 *
 * Adds NodeJS types and server files to `tsconfig.app.json`.
 */
export function updateTsConfigApp(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigAppPath = 'tsconfig.app.json';

    context.logger.info(`⏳ Updating ${tsconfigAppPath} configuration...`);

    // Update tsconfig.app.json
    if (!tree.exists(tsconfigAppPath)) {
      throw new Error('tsconfig.app.json file not found');
    }

    const tsConfigAppContent = tree.read(tsconfigAppPath);
    if (!tsConfigAppContent) {
      throw new Error('Failed to read tsconfig.app.json file');
    }

    const tsConfigApp = parse(tsConfigAppContent.toString());

    // Add node types
    if (!tsConfigApp.types) {
      tsConfigApp.types = [];
    }
    if (!tsConfigApp.types.includes('node')) {
      tsConfigApp.types.push('node');
    }

    // Add 'main.server.ts' and 'server.ts' to files
    if (!tsConfigApp.files) {
      tsConfigApp.files = [];
    }
    const mainServerTsPath = 'src/main.server.ts';
    if (!tsConfigApp.files.includes(mainServerTsPath)) {
      tsConfigApp.files.push(mainServerTsPath);
    }
    const serverTsPath = 'server.ts';
    if (!tsConfigApp.files.includes(serverTsPath)) {
      tsConfigApp.files.push(serverTsPath);
    }

    tree.overwrite(tsconfigAppPath, JSON.stringify(tsConfigApp, null, 2));

    context.logger.info(`✅ Updated ${tsconfigAppPath} configuration`);
  };
}
