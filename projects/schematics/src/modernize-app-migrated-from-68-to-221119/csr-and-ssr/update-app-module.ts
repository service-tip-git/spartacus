/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

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

    let sourceText = content.toString();

    // Remove HttpClientModule from imports
    sourceText = sourceText.replace(/HttpClientModule,?\s*/g, '');
    sourceText = sourceText.replace(
      /import\s*{\s*HttpClientModule\s*}\s*from\s*'@angular\/common\/http'\s*;\s*\n?/g,
      ''
    );

    // Add provideHttpClient to providers
    if (!sourceText.includes('provideHttpClient')) {
      sourceText = sourceText.replace(
        /providers:\s*\[/,
        'providers: [\n    provideHttpClient(withFetch(), withInterceptorsFromDi()),'
      );

      // Add imports
      const httpImport =
        "import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';\n";
      if (sourceText.includes('import {')) {
        sourceText = sourceText.replace(/import {/, `${httpImport}import {`);
      } else {
        // Add at the top after any license comments
        sourceText = sourceText.replace(
          /^(\s*\/\*[\s\S]*?\*\/\s*)?/,
          `$1${httpImport}\n`
        );
      }
    }

    // For SSR apps, update BrowserModule
    sourceText = sourceText.replace(
      /BrowserModule\.withServerTransition\(\s*{\s*appId:\s*['"]serverApp['"]\s*}\s*\)/,
      'BrowserModule'
    );

    tree.overwrite(appModulePath, sourceText);

    context.logger.info(`✅ Updated ${appModulePath}`);
  };
}
