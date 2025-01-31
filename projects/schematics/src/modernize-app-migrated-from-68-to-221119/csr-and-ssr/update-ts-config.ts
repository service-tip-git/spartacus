import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

/**
 * Updates the `tsconfig.json` file for new Angular v17 standards.
 *
 * Removes some of the `compilerOptions` and adds new recommended ones.
 */
export function updateTsConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigPath = 'tsconfig.json';
    context.logger.info(`⏳ Updating ${tsconfigPath}...`);

    if (!tree.exists(tsconfigPath)) {
      throw new Error(`${tsconfigPath} file not found`);
    }

    const tsConfigContent = tree.read(tsconfigPath);
    if (!tsConfigContent) {
      throw new Error(`Failed to read ${tsconfigPath} file`);
    }

    const tsConfig = parse(tsConfigContent.toString());

    if (!tsConfig.compilerOptions) {
      throw new Error(`No compilerOptions found in ${tsconfigPath}`);
    }

    // Remove options
    delete tsConfig.compilerOptions.baseUrl;
    delete tsConfig.compilerOptions.forceConsistentCasingInFileNames;
    delete tsConfig.compilerOptions.downlevelIteration;

    tsConfig.compilerOptions.skipLibCheck = true;
    tsConfig.compilerOptions.esModuleInterop = true;

    tree.overwrite(tsconfigPath, JSON.stringify(tsConfig, null, 2));

    context.logger.info(`✅ Updated ${tsconfigPath}`);
  };
}
