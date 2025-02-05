import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

export function updateMainTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const mainTsPath = 'src/main.ts';
    context.logger.info(`\n⏳ Updating ${mainTsPath}...`);

    if (!tree.exists(mainTsPath)) {
      printErrorWithAdviceToFollowDocs(`${mainTsPath} file not found`, context);
      return;
    }

    const content = tree.read(mainTsPath);
    if (!content) {
      printErrorWithAdviceToFollowDocs(
        `Failed to read ${mainTsPath} file`,
        context
      );
      return;
    }

    let mainTs = content.toString();

    context.logger.info(
      '  ↳ Adding "ngZoneEventCoalescing" option to "bootstrapModule()" call'
    );
    mainTs = mainTs.replace(
      /platformBrowserDynamic\(\)\.bootstrapModule\(AppModule\)/,
      'platformBrowserDynamic().bootstrapModule(AppModule, {\n  ngZoneEventCoalescing: true,\n})'
    );

    tree.overwrite(mainTsPath, mainTs);
    context.logger.info(`✅ Updated ${mainTsPath}`);
  };
}
