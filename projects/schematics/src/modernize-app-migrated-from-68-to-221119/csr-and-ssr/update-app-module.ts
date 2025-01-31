import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { removeImportFromContent } from '../../shared';

/**
 * Updates `app.module.ts` file for new Angular v17 standards.
 *
 * Removes `HttpClientModule` in favor of `provideHttpClient()`,
 * with using `withFetch` and `withInterceptorsFromDi()`,
 * and removes the obsolete method `BrowserModule.withServerTransition()`.
 */
export function updateAppModule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const appModulePath = 'src/app/app.module.ts';
    context.logger.info(`⏳ Updating ${appModulePath}...`);

    if (!tree.exists(appModulePath)) {
      context.logger.warn('⚠️ No app.module.ts found');
      return;
    }

    const content = tree.read(appModulePath);
    if (!content) {
      return;
    }

    let updatedContent = content.toString();

    // Remove import of HttpClientModule
    updatedContent = removeImportFromContent(updatedContent, {
      importPath: 'HttpClientModule',
    });

    // Remove usage of HttpClientModule
    updatedContent = updatedContent.replace(/HttpClientModule,?\s*/g, '');

    // Add provideHttpClient to providers
    if (!updatedContent.includes('provideHttpClient')) {
      updatedContent = updatedContent.replace(
        /providers:\s*\[/,
        'providers: [\n    provideHttpClient(withFetch(), withInterceptorsFromDi()),'
      );

      // Add imports
      const httpImport =
        "import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';\n";
      if (updatedContent.includes('import {')) {
        updatedContent = updatedContent.replace(
          /import {/,
          `${httpImport}import {`
        );
      }
    }

    tree.overwrite(appModulePath, updatedContent);

    context.logger.info(`✅ Updated ${appModulePath}`);
  };
}
