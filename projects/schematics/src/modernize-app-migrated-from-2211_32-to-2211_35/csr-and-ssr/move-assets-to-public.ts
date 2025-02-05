import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

export function moveAssetsToPublic(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const oldPath = 'src/assets';
    const newPath = 'public';
    context.logger.info(
      `\n⏳ Moving assets folder from "${oldPath}/" to "${newPath}/"...`
    );

    if (!tree.exists(oldPath)) {
      printErrorWithAdviceToFollowDocs(
        `Assets folder not found at ${oldPath}`,
        context
      );
      return;
    }

    context.logger.info(
      `  ↳ Creating "${newPath}" directory if it does not exist`
    );
    if (!tree.exists(newPath)) {
      tree.create(newPath, '');
    }

    context.logger.info(
      `  ↳ Moving all files from "${oldPath}" to "${newPath}"`
    );
    tree.getDir(oldPath).visit((filePath) => {
      const content = tree.read(`${oldPath}/${filePath}`);
      if (content) {
        tree.create(`${newPath}/${filePath}`, content);
      }
    });

    context.logger.info(`  ↳ Deleting old "${oldPath}" directory`);
    tree.delete(oldPath);

    context.logger.info(
      `✅ Moved assets folder from "${oldPath}/" to "${newPath}/"`
    );
  };
}
