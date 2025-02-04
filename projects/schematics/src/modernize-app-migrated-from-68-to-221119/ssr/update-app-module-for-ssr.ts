import { Rule } from '@angular-devkit/schematics';

export function updateAppModuleForSsr(): Rule {
  return (tree, context) => {
    const appModulePath = 'src/app/app.module.ts';
    context.logger.info(`⏳ Updating ${appModulePath} for SSR...`);

    if (!tree.exists(appModulePath)) {
      context.logger.warn('⚠️ No app.module.ts found');
      return;
    }

    const content = tree.read(appModulePath);
    if (!content) {
      return;
    }

    let updatedContent = content.toString();

    // For SSR apps, update BrowserModule
    updatedContent = updatedContent.replace(
      /BrowserModule\.withServerTransition\(\s*{\s*appId:\s*['"]serverApp['"]\s*}\s*\)/,
      'BrowserModule'
    );

    tree.overwrite(appModulePath, updatedContent);

    context.logger.info(`✅ Updated ${appModulePath} for SSR`);
  };
}
