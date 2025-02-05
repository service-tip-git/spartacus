import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 } from '../fallback-advice-to-follow-docs';

export function updateServerTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const oldPath = 'server.ts';
    const newPath = 'src/server.ts';

    context.logger.info(
      `\n⏳ Moving ${oldPath} to ${newPath} and updating implementation...`
    );

    if (!tree.exists(oldPath)) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `${oldPath} file not found`,
        context
      );
      return;
    }

    const content = tree.read(oldPath);
    if (!content) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `Failed to read ${oldPath} file`,
        context
      );
      return;
    }

    let serverTs = content.toString();

    context.logger.info(
      '  ↳ Updating import path from "./src/main.server" to "./main.server"'
    );
    serverTs = serverTs.replace(
      /from ['"]\.\/src\/main\.server['"];/,
      "from './main.server';"
    );

    context.logger.info(
      `  ↳ Moving the file "${oldPath}" to "${newPath}" with the updated content`
    );
    tree.create(newPath, serverTs);
    tree.delete(oldPath);

    context.logger.info(`✅ Moved and updated ${oldPath} to ${newPath}`);
  };
}
