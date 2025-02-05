import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 as printErrorWithDocs } from '../fallback-advice-to-follow-docs';

/**
 * Moves the `src/assets/` folder to the root and renames it to `public/`,
 * to adapt to the new Angular v19 standards.
 */
export function moveAssetsToPublic(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const oldPath = 'src/assets';
    const newPath = 'public';
    context.logger.info(
      `\n⏳ Moving assets folder from "${oldPath}/" to "${newPath}/"...`
    );

    if (!tree.exists(oldPath)) {
      printErrorWithDocs(`Assets folder not found at ${oldPath}`, context);
      return;
    }

    if (!tree.exists(newPath)) {
      context.logger.info(
        `  ↳ Creating "${newPath}" directory because it did not exist`
      );
      tree.create(newPath, '');
    }

    context.logger.info(
      `  ↳ Moving all files from "${oldPath}" to "${newPath}"`
    );
    try {
      tree.getDir(oldPath).visit((filePath) => {
        const content = tree.read(`${oldPath}/${filePath}`);
        if (content) {
          tree.create(`${newPath}/${filePath}`, content);
        }
      });
    } catch (error) {
      printErrorWithDocs(
        `Error moving assets file from "${oldPath}" to "${newPath}". Error: ${error}`,
        context
      );
    }

    context.logger.info(`  ↳ Deleting old "${oldPath}" directory`);
    tree.delete(oldPath);

    context.logger.info(
      `✅ Moved assets folder from "${oldPath}/" to "${newPath}/"`
    );
  };
}
