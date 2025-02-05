import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 } from '../fallback-advice-to-follow-docs';

export function updateTsConfigApp(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tsconfigAppPath = 'tsconfig.app.json';
    context.logger.info(`\n⏳ Updating ${tsconfigAppPath}...`);

    if (!tree.exists(tsconfigAppPath)) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `${tsconfigAppPath} file not found`,
        context
      );
      return;
    }

    const tsConfigContent = tree.read(tsconfigAppPath);
    if (!tsConfigContent) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `Failed to read ${tsconfigAppPath} file`,
        context
      );
      return;
    }

    const tsConfig = parse(tsConfigContent.toString());

    const oldPath = 'server.ts';
    const newPath = 'src/server.ts';
    context.logger.info(
      `  ↳ Updating path in "files" array from "${oldPath}" to "${newPath}"`
    );
    if (Array.isArray(tsConfig.files)) {
      const serverTsIndex = tsConfig.files.indexOf(oldPath);
      if (serverTsIndex !== -1) {
        tsConfig.files[serverTsIndex] = newPath;
      } else {
        printErrorWithDocsForMigrated_2211_32_To_2211_35(
          `Path "${oldPath}" not found in "files" array`,
          context
        );
        return;
      }
    } else {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `"files" array not found in ${tsconfigAppPath}`,
        context
      );
      return;
    }

    tree.overwrite(tsconfigAppPath, JSON.stringify(tsConfig, null, 2));
    context.logger.info(`✅ Updated ${tsconfigAppPath}`);
  };
}
