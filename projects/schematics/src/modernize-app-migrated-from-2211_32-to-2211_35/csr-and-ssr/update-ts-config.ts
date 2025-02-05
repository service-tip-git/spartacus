import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 } from '../fallback-advice-to-follow-docs';

export function updateTsConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigPath = 'tsconfig.json';
    context.logger.info(`\n⏳ Updating ${tsconfigPath}...`);

    if (!tree.exists(tsconfigPath)) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `${tsconfigPath} file not found`,
        context
      );
      return;
    }

    const tsConfigContent = tree.read(tsconfigPath);
    if (!tsConfigContent) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `Failed to read ${tsconfigPath} file`,
        context
      );
      return;
    }

    const tsConfig = parse(tsConfigContent.toString());

    if (!tsConfig.compilerOptions) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `No compilerOptions found in ${tsconfigPath}`,
        context
      );
      return;
    }

    context.logger.info(
      '  ↳ Adding "isolatedModules": true to compilerOptions'
    );
    tsConfig.compilerOptions.isolatedModules = true;

    context.logger.info('  ↳ Removing "sourceMap" from compilerOptions');
    delete tsConfig.compilerOptions.sourceMap;

    context.logger.info('  ↳ Removing "declaration" from compilerOptions');
    delete tsConfig.compilerOptions.declaration;

    context.logger.info(
      '  ↳ Removing "useDefineForClassFields" from compilerOptions'
    );
    delete tsConfig.compilerOptions.useDefineForClassFields;

    context.logger.info('  ↳ Removing "lib" from compilerOptions');
    delete tsConfig.compilerOptions.lib;

    context.logger.info(
      '  ↳ Updating "moduleResolution" to "bundler" in compilerOptions'
    );
    tsConfig.compilerOptions.moduleResolution = 'bundler';

    tree.overwrite(tsconfigPath, JSON.stringify(tsConfig, null, 2));
    context.logger.info(`✅ Updated ${tsconfigPath}`);
  };
}
