import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

/**
 * Updates TypeScript configurations related to SSR to align with new Angular v17 standards.
 *
 * Adds NodeJS types and server files to `tsconfig.app.json`,
 * and removes the `tsconfig.server.json` which is no longer needed.
 */
export function updateTsConfigsForSsr(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating TypeScript configurations for SSR...');

    // Update tsconfig.app.json
    const tsconfigAppPath = 'tsconfig.app.json';
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

    // Remove tsconfig.server.json
    const tsconfigServerPath = 'tsconfig.server.json';
    if (tree.exists(tsconfigServerPath)) {
      tree.delete(tsconfigServerPath);
    }

    context.logger.info('✅ Updated TypeScript configurations for SSR');
  };
}
