import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 } from '../fallback-advice-to-follow-docs';

export function moveFaviconToPublic(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fileName = 'favicon.ico';

    const oldDir = 'src';
    const oldPath = `${oldDir}/${fileName}`;

    const newDir = 'public';
    const newPath = `${newDir}/${fileName}`;

    context.logger.info(
      `\n⏳ Moving ${fileName} from "${oldPath}" to "${newPath}"...`
    );

    if (!tree.exists(oldPath)) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `Favicon not found at ${oldPath}`,
        context
      );
      return;
    }

    if (!tree.exists(newDir)) {
      context.logger.info(
        `  ↳ Creating "${newDir}" directory because it didn't exist`
      );
      tree.create(newDir, '');
    }

    const content = tree.read(oldPath);
    if (content) {
      tree.create(newPath, content);
      tree.delete(oldPath);
    } else {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        `Failed to read ${oldPath} file`,
        context
      );
      return;
    }

    context.logger.info(
      `✅ Moved favicon.ico from "${oldPath}" to "${newPath}"`
    );
  };
}
