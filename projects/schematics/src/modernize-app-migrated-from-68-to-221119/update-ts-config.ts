import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

/**
 * Updates the TypeScript configuration for new Angular v17 standards.
 *
 * Removes some of the `compilerOptions` and adds new recommended ones.
 */
export function updateTsConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating TypeScript configuration...');

    const tsconfigPath = 'tsconfig.json';
    if (!tree.exists(tsconfigPath)) {
      context.logger.warn('⚠️ No tsconfig.json found');
      return;
    }

    const tsConfigContent = tree.read(tsconfigPath);
    if (tsConfigContent) {
      const tsConfig = parse(tsConfigContent.toString());

      if (tsConfig.compilerOptions) {
        delete tsConfig.compilerOptions.baseUrl;
        delete tsConfig.compilerOptions.forceConsistentCasingInFileNames;
        delete tsConfig.compilerOptions.downlevelIteration;

        tsConfig.compilerOptions.skipLibCheck = true;
        tsConfig.compilerOptions.esModuleInterop = true;
      }

      tree.overwrite(tsconfigPath, JSON.stringify(tsConfig, null, 2));
    }

    context.logger.info('✅ Updated TypeScript configuration');
  };
}
